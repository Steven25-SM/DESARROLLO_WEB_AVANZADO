const errorHandler = (err, req, res, next) => {
  console.error("❌ Error capturado en Middleware Global:", err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

module.exports = errorHandler;