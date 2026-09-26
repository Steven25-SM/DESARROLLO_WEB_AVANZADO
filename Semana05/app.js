require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Middlewares iniciales
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Importar rutas
const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");

// Rutas base
app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

// Capturar cualquier ruta no encontrada (404) y enviarla al middleware global
app.use((req, res, next) => {
  const error = new Error(`La ruta ${req.originalUrl} no existe`);
  error.statusCode = 404;
  next(error); // Pasa el error a errorHandler
});

// Importar y registrar Middleware Global de Errores (SIEMPRE AL FINAL DE LAS RUTAS)
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});