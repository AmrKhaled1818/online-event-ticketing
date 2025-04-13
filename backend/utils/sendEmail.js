// utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'nola.borer@ethereal.email',
        pass: 'PNQcRm3JRp2tNYPWHn',
      },
    });

    const mailOptions = {
      from: '"Eventify" <nola.borer@ethereal.email>',
      to: email,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    console.log("Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent:", info.response);
    console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;