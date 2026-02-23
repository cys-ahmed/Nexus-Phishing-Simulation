import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    const envContent = `SMTP_HOST=${account.smtp.host}
SMTP_PORT=${account.smtp.port}
SMTP_USER=${account.user}
SMTP_PASS=${account.pass}
SMTP_FROM="Nexus Phishing Simulator" <${account.user}>\n`;

    fs.writeFileSync('.env', envContent);
    console.log('Credentials successfully generated and saved to .env');
    console.log('');
    console.log('You can view the sent emails by logging into Ethereal Mail:');
    console.log('Login URL: https://ethereal.email/login');
    console.log('User:      ' + account.user);
    console.log('Password:  ' + account.pass);
});
