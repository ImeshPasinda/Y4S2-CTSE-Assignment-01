const mongoose = require('mongoose');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');
const Notification = require('../models/notificationModel');

const getEmailTemplate = (content, username) => {

  let templateFileName = '';

  if (content.template_type == 'register_success') {
    templateFileName = 'register-success-template.html';
    const templatePath = path.join(__dirname, '..', 'templates', 'email', templateFileName);
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    emailTemplate = emailTemplate.replace('{{recipient}}', username);

    return emailTemplate;
  }
  if (content.template_type == 'payment_success') {
    templateFileName = 'payment-success-template.html';
    const templatePath = path.join(__dirname, '..', 'templates', 'email', templateFileName);
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    emailTemplate = emailTemplate.replace('{{recipient}}', username);
    emailTemplate = emailTemplate.replace('{{courseName}}', content.courseName);
    emailTemplate = emailTemplate.replace('{{transactionId}}', content.transactionId);
    emailTemplate = emailTemplate.replace('{{coursePrice}}', content.coursePrice);
    emailTemplate = emailTemplate.replace('{{courseLink}}', content.courseLink);

    return emailTemplate;
  }
};

const sendEmail = async (req, res) => {

  const { email, username, userId, subject, content } = req.body;

  const notification = new Notification({
    userId: userId,
    recipient: email,
    content: content,
    sentAt: new Date(),
  });

  try {
    await notification.save();
  } catch (error) {
    console.error('Failed to save notification:', error);
    return res.status(500).json({ success: false, error: 'Failed to save notification' });
  }

  const emailTemplate = getEmailTemplate(content, username);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SERVICE_EMAIL,
      pass: process.env.MAIL_SERVICE_PASS,
    },
    logger: true,
    debug: true,
  });

  const mailOptions = {
    from: 'Learnopia <' + process.env.SERVICE_EMAIL + '>',
    to: email,
    subject: subject,
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(201).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
};

module.exports = { sendEmail };
