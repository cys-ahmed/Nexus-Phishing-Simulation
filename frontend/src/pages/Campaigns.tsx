import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, Send, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [targetsCount, setTargetsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', subject: '', email_template: '', landing_page_template: '' });

    const templates = [
        {
            label: '-- Select a predefined template --',
            name: '', subject: '', email_template: '', landing_page_template: ''
        },
        {
            label: 'IT Password Expiry',
            name: 'IT Password Expiry',
            subject: 'ACTION REQUIRED: Password Expiry Notice',
            email_template: '<div style="font-family: Arial; padding: 20px;"><h2>Hello {{first_name}},</h2><p>Your corporate password expires in 24 hours.</p><p>Please <a href="{{link}}">click here to update your password</a> immediately.</p><p>IT Desk</p></div>',
            landing_page_template: '<div style="text-align:center; padding:50px; font-family: Arial;"><h2>IT Portal Session Expired</h2><p>Please log in again to continue.</p><form method="POST"><input name="username" placeholder="Username"/><br/><br/><input type="password" name="password" placeholder="Password"/><br/><br/><button type="submit" style="padding: 10px 20px;">Log In</button></form></div>'
        },
        {
            label: 'LinkedIn Security Verification',
            name: 'LinkedIn Security Verification',
            subject: 'LinkedIn Security: Your account requires immediate verification',
            email_template: '<div style="font-family: Arial; padding: 20px;"><h2>Action Required: Verify your identity to maintain access</h2><p>Hi {{first_name}},</p><p>Your account has been temporarily flagged for an authentication review. If this review is not completed within 48 hours, your profile visibility and messaging capabilities will be restricted.</p><a href="{{link}}" style="background-color: #0a66c2; padding: 10px 20px; color: white; text-decoration: none;">Verify Account securely</a></div>',
            landing_page_template: '<div style="text-align:center; padding:50px; font-family: Arial; max-width: 400px; margin: 0 auto;"><h2>Sign in securely</h2><p style="color: grey;">Stay updated on your professional world.</p><form method="POST"><input name="email" type="email" placeholder="Email or Phone" style="width: 100%; padding: 10px; margin-bottom: 15px;"/><br/><input type="password" name="password" placeholder="Password" style="width: 100%; padding: 10px; margin-bottom: 15px;"/><br/><button type="submit" style="width: 100%; padding: 10px; font-weight: bold; background-color: #0a66c2; color: white; border: none; border-radius: 20px;">Sign in</button></form></div>'
        },
        {
            label: 'Microsoft 365 Unusual Activity',
            name: 'M365 Suspicious Login',
            subject: 'Microsoft Security Alert: Unusual sign-in activity',
            email_template: '<div style="font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; padding: 20px;"><div style="background-color: #0078D4; padding: 10px; color: white;"><h2>Microsoft Security Request</h2></div><h3>Unusual sign-in activity</h3><p>Dear {{first_name}},</p><p>We detected something unusual about a recent sign-in to the Microsoft account attached to your profile.</p><p><strong>Sign-in details:</strong><br>Location: Moscow, Russia<br>IP Address: 45.188.29.11<br>Time: Just now</p><p>If this was not you, please report the user and secure your account immediately.</p><a href="{{link}}" style="background-color: #0078D4; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">Secure My Account Now</a><p style="margin-top: 20px; font-size: 12px; color: gray;">To opt out or change where you receive security notifications, click here.</p></div>',
            landing_page_template: '<div style="text-align:center; padding:50px; font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; max-width: 440px; margin: 0 auto; border: 1px solid lightgray; box-shadow: 0 2px 6px rgba(0,0,0,0.2);"><h2>Microsoft</h2><h3>Sign in</h3><form method="POST"><input name="username" placeholder="Email, phone, or Skype" style="width: 100%; padding: 10px; border-bottom: 1px solid gray; border-top: 0; border-left: 0; border-right: 0;"/><br/><br/><input type="password" name="password" placeholder="Password" style="width: 100%; padding: 10px; border-bottom: 1px solid gray; border-top: 0; border-left: 0; border-right: 0;"/><br/><br/><button type="submit" style="background-color: #0078D4; color: white; padding: 10px 30px; border: none; align-self: flex-end;">Next</button></form></div>'
        },
        {
            label: 'Human Resources: Updated Policy',
            name: 'HR Policy Update Q3',
            subject: 'Action Required: Updated Harassment Policy Acknowledgement',
            email_template: '<div style="font-family: Arial; padding: 20px;"><h2>Important HR Update</h2><p>Hello {{first_name}} {{last_name}},</p><p>The HR Department has updated the mandatory Anti-Harassment and Diversity policy for Q3.</p><p>You are required to read the new changes and sign the digital acknowledgement form by the end of this week. Failure to acknowledge may result in suspension of your network privileges.</p><a href="{{link}}" style="background-color: firebrick; padding: 10px 20px; color: white; text-decoration: none;">Review & Sign Document</a><p>- The Human Resources Team</p></div>',
            landing_page_template: '<div style="text-align:center; padding:50px; font-family: Arial; max-width: 500px; margin: auto;"><h2>HR Secure Portal</h2><p>Please enter your employee credentials to access the confidential document.</p><form method="POST"><input name="employee_id" placeholder="Employee ID Number"/><br/><br/><input type="password" name="sso_password" placeholder="SSO Password"/><br/><br/><button type="submit" style="padding: 10px; background-color: purple; color: white; border: none; width: 100%;">Access Document</button></form></div>'
        },
        {
            label: 'Zoom: Fake Meeting Invite',
            name: 'Fake Zoom Invite',
            subject: 'CEO has invited you to a scheduled Zoom meeting.',
            email_template: '<div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;"><img src="https://st1.zoom.us/static/6.3.20815/image/new/ZoomLogo.png" alt="Zoom" width="100"/><br/><h1 style="color: #0b5cff; margin-top: 20px;">Join your scheduled meeting</h1><p style="font-size: 16px;">Hi {{first_name}},<br>You are invited to join an expedited company-wide sync meeting happening right now.</p><div style="margin: 30px 0;"><a href="{{link}}" style="background-color: #0b5cff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">Join Meeting</a></div><p style="color: gray; font-size: 12px;">Meeting ID: 948 271 202<br>Passcode: 110291</p></div>',
            landing_page_template: '<div style="text-align:center; padding:50px; font-family: Arial, sans-serif;"><h2>Zoom Authentication</h2><p>Your session has timed out. Enter your enterprise credentials to join the meeting.</p><form method="POST"><input name="email" type="email" placeholder="Email address" style="padding: 10px; width: 200px;"/><br/><br/><input type="password" name="password" placeholder="Password" style="padding: 10px; width: 200px;"/><br/><br/><button type="submit" style="background-color: #0b5cff; color: white; padding: 10px 30px; border: none; border-radius: 5px;">Sign In</button></form></div>'
        },
        {
            label: 'Discord: Suspicious Login',
            name: 'Discord Suspicious Login',
            subject: 'New login from an unrecognized device',
            email_template: '<div style="background-color: #f9f9f9; padding: 40px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;"><div style="max-width: 500px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><div style="background-color: #5865F2; padding: 20px; text-align: center;"><img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg" alt="Discord" width="40" style="filter: brightness(0) invert(1);" /></div><div style="padding: 30px; color: #4f545c;"><h2 style="color: #23272a; margin-top: 0;">New login from an unrecognized device</h2><p>Hey {{first_name}},</p><p>We detected a login to your Discord account from a new location. If this was you, you can ignore this email. If this wasn\'t you, please change your password immediately.</p><div style="background-color: #f6f6f7; padding: 15px; border-radius: 4px; margin: 20px 0; font-size: 14px;"><strong>IP Address:</strong> 185.34.21.9<br><strong>Location:</strong> Saint Petersburg, Russia<br><strong>Time:</strong> Just now</div><div style="text-align: center; margin-top: 30px;"><a href="{{link}}" style="background-color: #5865F2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 15px; display: inline-block;">Verify Account</a></div></div></div></div>',
            landing_page_template: '<div style="height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #5865F2; background-image: url(\'https://discord.com/assets/7c8f476123d28d103efe381543274c25.png\'); background-size: cover; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;"><div style="background-color: #36393f; padding: 32px; border-radius: 5px; box-shadow: 0 2px 10px 0 rgba(0,0,0,.2); width: 480px; text-align: center; color: #dcddde;"><h3 style="color: white; margin-bottom: 8px; font-size: 24px; font-weight: 600;">Welcome back!</h3><p style="color: #b9bbbe; margin-bottom: 20px; font-size: 16px;">We\'re so excited to see you again!</p><form method="POST" style="text-align: left;"><label style="color: #b9bbbe; font-size: 12px; font-weight: 600; text-transform: uppercase;">Email or Phone Number <span style="color: #f04747;">*</span></label><input name="email" type="text" style="width: 100%; padding: 10px; margin-top: 8px; margin-bottom: 20px; background-color: #202225; border: 1px solid #202225; border-radius: 3px; color: #dcddde; font-size: 16px; outline: none; box-sizing: border-box;" required /><label style="color: #b9bbbe; font-size: 12px; font-weight: 600; text-transform: uppercase;">Password <span style="color: #f04747;">*</span></label><input name="password" type="password" style="width: 100%; padding: 10px; margin-top: 8px; margin-bottom: 8px; background-color: #202225; border: 1px solid #202225; border-radius: 3px; color: #dcddde; font-size: 16px; outline: none; box-sizing: border-box;" required /><a href="#" style="color: #00aff4; font-size: 14px; text-decoration: none; display: inline-block; margin-bottom: 20px;">Forgot your password?</a><button type="submit" style="width: 100%; background-color: #5865F2; color: white; padding: 10px; border: none; border-radius: 3px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;">Log In</button></form></div></div>'
        },
        {
            label: 'Discord: Server Invite',
            name: 'Discord Server Invite',
            subject: 'You have been invited to join a server',
            email_template: '<div style="background-color: #f9f9f9; padding: 40px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;"><div style="max-width: 500px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><div style="background-color: #202225; padding: 30px; text-align: center; border-bottom: 1px solid #36393f;"><h1 style="color: white; margin: 0;">You\'ve been invited to join</h1></div><div style="background-color: #36393f; padding: 30px; color: #dcddde; text-align: center;"><div style="width: 80px; height: 80px; background-color: #5865F2; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: white; font-weight: bold;">S</div><h2 style="color: white; margin-top: 0;">Secret Development Server</h2><p style="color: #b9bbbe; font-size: 14px; margin-bottom: 30px;"><span style="display:inline-block; width:8px; height:8px; background-color:#3ba55d; border-radius:50%; margin-right:5px;"></span> 14 Online <span style="display:inline-block; width:8px; height:8px; background-color:#72767d; border-radius:50%; margin-right:5px; margin-left:15px;"></span> 43 Members</p><a href="{{link}}" style="display: block; width: 100%; background-color: #5865F2; color: white; padding: 14px 0; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 15px; box-sizing: border-box;">Accept Invite</a></div></div></div>',
            landing_page_template: '<div style="height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #5865F2; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;"><div style="background-color: #36393f; padding: 32px; border-radius: 5px; box-shadow: 0 2px 10px 0 rgba(0,0,0,.2); width: 480px; text-align: center; color: #dcddde;"><div style="width: 64px; height: 64px; background-color: #5865F2; border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; font-weight: bold;">S</div><h3 style="color: white; margin-bottom: 8px; font-size: 24px; font-weight: 600;">Secret Development Server</h3><p style="color: #b9bbbe; margin-bottom: 24px; font-size: 14px;">You must be logged in to claim this invite.</p><form method="POST" style="text-align: left;"><label style="color: #b9bbbe; font-size: 12px; font-weight: 600; text-transform: uppercase;">Email <span style="color: #f04747;">*</span></label><input name="email" type="email" style="width: 100%; padding: 10px; margin-top: 8px; margin-bottom: 20px; background-color: #202225; border: 1px solid #202225; border-radius: 3px; color: #dcddde; font-size: 16px; outline: none; box-sizing: border-box;" required /><label style="color: #b9bbbe; font-size: 12px; font-weight: 600; text-transform: uppercase;">Password <span style="color: #f04747;">*</span></label><input name="password" type="password" style="width: 100%; padding: 10px; margin-top: 8px; margin-bottom: 20px; background-color: #202225; border: 1px solid #202225; border-radius: 3px; color: #dcddde; font-size: 16px; outline: none; box-sizing: border-box;" required /><button type="submit" style="width: 100%; background-color: #5865F2; color: white; padding: 10px; border: none; border-radius: 3px; font-size: 16px; font-weight: 600; cursor: pointer;">Login & Accept Invite</button></form><div style="margin-top: 16px; font-size: 14px; color: #72767d;">Need an account? <a href="#" style="color: #00aff4; text-decoration: none;">Register</a></div></div></div>'
        },
        {
            label: 'Kaizen365-Tech: Job Application Update',
            name: 'Kaizen365 Job Application',
            subject: 'Update regarding your application at Kaizen365-Tech',
            email_template: '<div style="font-family: \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; padding: 30px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-top: 5px solid #0f766e; border-radius: 8px;"><div style="text-align: center; margin-bottom: 20px;"><h2 style="color: #0f766e; margin: 0; font-size: 28px;">Kaizen365-Tech</h2><p style="margin: 0; color: #6b7280; font-size: 14px;">Careers & Talent Acquisition</p></div><p style="font-size: 16px;">Dear {{first_name}},</p><p style="font-size: 16px;">Thank you for your interest in joining the team at <strong>Kaizen365-Tech</strong>. Our hiring managers have finished reviewing your preliminary application materials.<br><br>Before we can move forward with scheduling the next stage of your interview process, we require you to complete a mandatory background check questionnaire and upload a copy of your most recent ID.</p><p style="font-size: 16px;">Please log in to your secure applicant portal below to complete these required steps within the next 48 hours.</p><div style="text-align: center; margin: 35px 0;"><a href="{{link}}" style="background-color: #0f766e; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(15, 118, 110, 0.2);">Access Application Portal</a></div><p style="font-size: 14px; color: #4b5563;">We look forward to speaking with you soon.</p><hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"><p style="font-size: 12px; color: #9ca3af; text-align: center;">© 2026 Kaizen365-Tech Inc. All rights reserved.<br>Confidentiality Notice: This email is intended solely for the applicant.</p></div>',
            landing_page_template: '<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f3f4f6; font-family: \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;"><div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 100%; max-width: 420px; box-sizing: border-box;"><div style="text-align: center; margin-bottom: 30px;"><h2 style="color: #0f766e; margin: 0; font-size: 32px; font-weight: bold;">Kaizen365-Tech</h2><p style="color: #6b7280; margin-top: 5px; font-size: 15px;">Candidate Application Portal</p></div><h3 style="color: #111827; font-size: 20px; margin-bottom: 20px; text-align: center;">Secure Login</h3><form method="POST"><div style="margin-bottom: 16px;"><label style="display: block; color: #374151; font-size: 14px; font-weight: 500; margin-bottom: 6px;">Email Address</label><input name="email" type="email" placeholder="Enter your email" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; box-sizing: border-box; font-size: 15px; transition: border-color 0.2s;" required /></div><div style="margin-bottom: 24px;"><label style="display: block; color: #374151; font-size: 14px; font-weight: 500; margin-bottom: 6px;">Portal Password</label><input name="password" type="password" placeholder="Enter your password" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; outline: none; box-sizing: border-box; font-size: 15px; transition: border-color 0.2s;" required /></div><button type="submit" style="width: 100%; background-color: #0f766e; color: white; padding: 14px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;">Sign In to Continue</button></form><div style="text-align: center; margin-top: 20px; font-size: 14px; color: #6b7280;"><a href="#" style="color: #0f766e; text-decoration: none; font-weight: 500;">Forgot password?</a> or <a href="#" style="color: #0f766e; text-decoration: none; font-weight: 500;">Create account</a></div></div></div>'
        }
    ];

    const fetchData = async () => {
        try {
            const [cR, tR] = await Promise.all([
                axios.get(`${API_URL}/api/campaigns`),
                axios.get(`${API_URL}/api/targets`)
            ]);
            setCampaigns(cR.data);
            setTargetsCount(tR.data.length);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/campaigns`, formData);
            setFormData({ name: '', subject: '', email_template: '', landing_page_template: '' });
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(`Failed to create campaign: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDeleteCampaign = async (id: number) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;
        try {
            await axios.delete(`${API_URL}/api/campaigns/${id}`);
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(`Failed to delete campaign: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleLaunch = async (id: number) => {
        try {
            await axios.post(`${API_URL}/api/campaigns/${id}/launch`);
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(`Failed to launch campaign: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleRelaunch = async (id: number) => {
        if (!confirm('This will wipe all tracking stats for this campaign and send the emails again. Are you sure?')) return;
        try {
            await axios.post(`${API_URL}/api/campaigns/${id}/relaunch`);
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(`Failed to relaunch campaign: ${error.response?.data?.error || error.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="animate-fade-in delay-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Send size={32} color="var(--primary)" />
                <h1 style={{ margin: 0 }}>Campaigns Management</h1>
            </div>
            <p className="subtitle">
                Create and launch phishing simulations. Total available targets: <strong>{targetsCount}</strong>
            </p>

            <div className="grid-cols-2">
                <div className="card animate-fade-in delay-2" style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <PlusCircle size={20} color="var(--text-main)" />
                        <h2 style={{ margin: 0 }}>Create New Campaign</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <select
                            onChange={(e) => {
                                const t = templates[Number(e.target.value)];
                                setFormData({ name: t.name, subject: t.subject, email_template: t.email_template, landing_page_template: t.landing_page_template || '' });
                            }}
                            style={{ width: '100%', marginBottom: '10px', padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                        >
                            {templates.map((t, idx) => (
                                <option key={idx} value={idx}>{t.label}</option>
                            ))}
                        </select>
                        <input name="name" placeholder="Campaign Name (e.g., Q3 Security Awareness)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        <input name="subject" placeholder="Email Subject (e.g., Mandatory Password Reset)" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required />
                        <textarea name="email_template" placeholder="HTML Email Template. Use {{first_name}}, {{last_name}}, {{link}}" value={formData.email_template} onChange={e => setFormData({ ...formData, email_template: e.target.value })} rows={6} required></textarea>
                        <textarea name="landing_page_template" placeholder="HTML Landing Page (optional)." value={formData.landing_page_template} onChange={e => setFormData({ ...formData, landing_page_template: e.target.value })} rows={4}></textarea>
                        <button type="submit" style={{ width: '100%' }}>Save Campaign</button>
                    </form>
                </div>

                <div className="card animate-fade-in delay-3" style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <Users size={20} color="var(--text-main)" />
                        <h2 style={{ margin: 0 }}>All Campaigns ({campaigns.length})</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Stats</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map(c => (
                                <tr key={c.id}>
                                    <td>
                                        <strong style={{ color: 'var(--text-main)' }}>{c.name}</strong><br />
                                        <small style={{ color: 'var(--text-muted)' }}>{c.subject}</small>
                                    </td>
                                    <td>
                                        <span className={`badge ${c.status.toLowerCase()}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                                            <span style={{ color: '#f59e0b' }} title="Emails Opened">👁 {c.opened_count || 0}</span>
                                            <span style={{ color: '#10b981' }} title="Links Clicked">↗️ {c.clicked_count || 0}</span>
                                            <span style={{ color: '#ef4444' }} title="Credentials Captured">🔑 {c.submitted_count || 0}</span>
                                        </div>
                                    </td>
                                    <td style={{ display: 'flex', gap: '8px' }}>
                                        {c.status === 'draft' && targetsCount > 0 && (
                                            <button
                                                onClick={() => handleLaunch(c.id)}
                                                style={{ padding: '6px 12px', fontSize: '12px', transition: 'all 0.2s', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                                            >
                                                Launch
                                            </button>
                                        )}
                                        {c.status === 'completed' && targetsCount > 0 && (
                                            <button
                                                onClick={() => handleRelaunch(c.id)}
                                                style={{ padding: '6px 12px', fontSize: '12px', transition: 'all 0.2s', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                                                title="Reset stats and resend emails"
                                            >
                                                Relaunch
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteCampaign(c.id)}
                                            style={{ padding: '6px 12px', fontSize: '12px', transition: 'all 0.2s', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {campaigns.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No campaigns created yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
