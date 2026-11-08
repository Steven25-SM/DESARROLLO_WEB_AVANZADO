const NotificationService = require("../services/NotificationService");
const service = new NotificationService();

exports.list = (req, res) => {
  const notifications = service.list();
  res.json(notifications);
};

exports.create = async (req, res) => {
  try {
    const { type, message, ticketId } = req.body;
    const newNotification = await service.create(type, message, ticketId);
    res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error en controller:", error);
    res.status(500).json({ error: error.message });
  }
};