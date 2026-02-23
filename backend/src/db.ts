import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Initialize the database in the root folder to keep data
const dbPath = path.resolve(process.cwd(), '../phishing-simulator.db');
const db: DatabaseType = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initialize schema
const initDb = () => {
    const schema = `
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      email_template TEXT NOT NULL,
      landing_page_template TEXT,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      first_name TEXT,
      last_name TEXT
    );

    CREATE TABLE IF NOT EXISTS campaign_targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER,
      target_id INTEGER,
      tracking_id TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending',
      opened_at DATETIME,
      clicked_at DATETIME,
      submitted_at DATETIME,
      submitted_data TEXT,
      FOREIGN KEY (campaign_id) REFERENCES campaigns (id),
      FOREIGN KEY (target_id) REFERENCES targets (id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_id TEXT,
      event_type TEXT NOT NULL, -- 'open', 'click', 'submit'
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tracking_id) REFERENCES campaign_targets (tracking_id)
    );
  `;
    db.exec(schema);
};

// Run initialization
initDb();

export default db;
