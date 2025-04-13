// utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // or "Outlook", or use `host`, `port`, `auth` manually
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Eventify" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📨 Email sent:", info.response);
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};

export default sendEmail;
