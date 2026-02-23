import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('--- SMTP Configuration Loaded ---');
console.log(`Host: ${process.env.SMTP_HOST}`);
console.log(`User: ${process.env.SMTP_USER}`);
console.log('---------------------------------');

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'password',
    },
});

export const sendPhishingEmail = async (to: string, subject: string, html: string) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"IT Support" <support@yourcompany.com>',
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};
