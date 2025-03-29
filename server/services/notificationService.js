const nodemailer = require('nodemailer');
const twilio = require('twilio');
const config = require('../config/notification.config');

const emailTransporter = nodemailer.createTransport(config.email);
const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);

const notificationService = {
  async sendEmail(to, subject, content) {
    await emailTransporter.sendMail({
      from: config.email.auth.user,
      to,
      subject,
      html: content
    });
  },

  async sendSMS(to, message) {
    await twilioClient.messages.create({
      body: message,
      to,
      from: config.twilio.phoneNumber
    });
  },

  async notifyPaymentDue(loan) {
    const emailContent = `
      <h2>Payment Reminder</h2>
      <p>Your loan payment of $${loan.monthly_payment} is due on ${loan.next_payment_date}.</p>
      <p>Loan Reference: ${loan.ref_no}</p>
    `;

    await this.sendEmail(loan.borrower_email, 'Loan Payment Due', emailContent);
    
    if (loan.borrower_phone) {
      const smsContent = `Payment Reminder: Your loan payment of $${loan.monthly_payment} is due on ${loan.next_payment_date}. Ref: ${loan.ref_no}`;
      await this.sendSMS(loan.borrower_phone, smsContent);
    }
  }
};

module.exports = notificationService;
