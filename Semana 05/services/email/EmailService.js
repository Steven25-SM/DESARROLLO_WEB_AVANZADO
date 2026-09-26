require("dotenv").config();
const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true para puerto 465, false para 587
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY,
      },
      family: 4, // <-- Obliga a Node.js a usar IPv4 en lugar de IPv6
    });
  }

  async sendEmail(options) {
    const { to, subject, htmlBody } = options;

    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAILER_EMAIL,
        to: to,
        subject: subject,
        html: htmlBody,
      });

      console.log("✅ EMAIL ENVIADO CON ÉXITO:", info.response);
      return true;
    } catch (error) {
      console.error("❌ ERROR ENVIANDO EMAIL:", error);
      return false;
    }
  }
}

module.exports = EmailService;