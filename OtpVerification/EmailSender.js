const nodemailer = require('nodemailer');

const EMAIL_USER = 'mubashiraijaz1@gmail.com';      // Sender email
const EMAIL_PASS = 'rklshqmdblymbutp';           // Gmail App Password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

/**
 * Sends an email with the given subject and HTML content
 * @param {string} to - Recipient email (user's email)
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Liflow" <${EMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    throw error;
  }
};

module.exports = sendEmail;
