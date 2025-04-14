// utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async ({ email, subject, message }) => {
  try {
    console.log("Email configuration:", {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS ? "Set" : "Not Set",
      from: process.env.EMAIL_FROM,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Eventify" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    console.log("Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;