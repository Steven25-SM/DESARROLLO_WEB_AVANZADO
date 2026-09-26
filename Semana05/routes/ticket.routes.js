const express = require("express");
const router = express.Router();
const controller = require("../controllers/TicketController");

router.get("/", controller.list);
router.get("/:id/notifications", controller.getNotificationsByTicket);

module.exports = router;