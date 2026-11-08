const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  async create(type, message, ticketId) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId
    };

    if (type === "email") {
      await this.emailService.sendEmail({
        to: "earevalo@tecsup.edu.pe",
        subject: "API RESTful - Alertas del sistema de Tickets",
        htmlBody: "<h1>" + message + "</h1>"
      });
    }

    return this.repo.save(notification);
  }

  list() {
    return this.repo.findAll();
  }
}

module.exports = NotificationService;