const express = require("express");
const router = express.Router();
const controller = require("../controllers/NotificationController");

router.get("/", controller.list);
router.post("/", controller.create); // <-- AGREGA ESTA LÍNEA

module.exports = router;