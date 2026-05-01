const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (email, name) => {
  await transporter.sendMail({
    from: `"Waste Food Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Waste Food Management System!',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for joining our platform to help reduce food waste.</p>
      <p>Together we can make a difference — one meal at a time. 🍱</p>
    `,
  });
};

const sendClaimEmail = async (donorEmail, donorName, receiverName, foodTitle) => {
  await transporter.sendMail({
    from: `"Waste Food Management" <${process.env.EMAIL_USER}>`,
    to: donorEmail,
    subject: `Your food listing "${foodTitle}" has been claimed!`,
    html: `
      <h2>Hi ${donorName},</h2>
      <p>Great news! Your food listing <strong>"${foodTitle}"</strong> has been claimed by <strong>${receiverName}</strong>.</p>
      <p>Please coordinate pickup with them through the platform.</p>
      <p>Thank you for your generous donation! 🙏</p>
    `,
  });
};

module.exports = { sendWelcomeEmail, sendClaimEmail };
