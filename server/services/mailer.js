import nodemailer from "nodemailer";
import env from "dotenv";

// Load environment variables from .env file
env.config();

// Create transporter (email sending configuration)
const transporter = nodemailer.createTransport({
  // SMTP server host (e.g., Gmail, Mailtrap, etc.)
  host: process.env.SMTP_HOST,

  // SMTP port (usually 587 or 465)
  port: process.env.SMTP_PORT,

  // false = use TLS (not SSL)
  secure: false,

  // Authentication details (your email credentials)
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // app password (not real password)
  },

  // Ignore SSL certificate errors (useful in dev/testing)
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to send email
const sendEmail = async (email, subject, content) => {
  // Send email using transporter
  const info = await transporter.sendMail({
    // Sender details (name + email)
    from: `"Prateekumar" <prateekumar27081997@gmail.com>`,

    // Receiver email
    to: email,

    // Email subject
    subject: subject,

    // Email body (HTML content)
    html: content,
  });

  // Log message ID for confirmation/debugging
  console.log("Email sent:", info.messageId);
};

// Export function to use in other files
export default sendEmail;
