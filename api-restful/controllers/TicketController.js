const TicketService = require("../services/TicketService");
const service = new TicketService();

const NotificationService = require("../services/NotificationService");
const notificationService = new NotificationService();

// 1. Obtener lista con paginación
exports.list = (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const allTickets = service.list();

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTickets = allTickets.slice(startIndex, endIndex);

    res.json({
      page,
      limit,
      totalTickets: allTickets.length,
      totalPages: Math.ceil(allTickets.length / limit),
      data: paginatedTickets
    });
  } catch (error) {
    next(error);
  }
};

// 2. Historial de notificaciones por ticket
exports.getNotificationsByTicket = (req, res, next) => {
  try {
    const { id } = req.params;
    const allNotifications = notificationService.list();
    const ticketNotifications = allNotifications.filter(n => n.ticketId === id);

    res.json(ticketNotifications);
  } catch (error) {
    next(error);
  }
};