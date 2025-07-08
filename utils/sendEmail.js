const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: process.env.SENDER_MAIL, // Must match verified sender
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent to:', to);
  } catch (error) {
    console.error('❌ SendGrid Error:', error.response?.body || error.message);
  }
};

module.exports = sendEmail;
