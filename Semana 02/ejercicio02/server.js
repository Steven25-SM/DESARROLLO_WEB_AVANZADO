const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

// Función auxiliar para renderizar cualquier vista .hbs
function renderView(viewName, data, res) {
  const filePath = path.join(__dirname, "views", viewName);

  fs.readFile(filePath, "utf8", (err, templateData) => {
    if (err) {
      res.statusCode = 500;
      res.end("Error interno del servidor");
      return;
    }

    const template = handlebars.compile(templateData);
    const html = template(data);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const data = {
      title: "Servidor con Handlebars 🚀",
      welcomeMessage: "Bienvenido al laboratorio de Node.js",
      day: new Date().toLocaleDateString("es-PE"),
      students: ["Ana", "Luis", "Pedro", "María"],
    };
    renderView("home.hbs", data, res);

  } else if (req.url === "/about") {
    const data = {
      title: "Acerca del curso",
      curso: "Desarrollo Web Avanzado",
      profesor: "Edwin Arévalo Sermeño",
      fecha: new Date().toLocaleDateString("es-PE"),
    };
    renderView("about.hbs", data, res);

  } else if (req.url === "/students") {
    const data = {
      title: "Lista de estudiantes",
      students: [
        { nombre: "Ana", nota: 18, destacado: 18 > 15 },
        { nombre: "Luis", nota: 12, destacado: 12 > 15 },
        { nombre: "Pedro", nota: 16, destacado: 16 > 15 },
        { nombre: "María", nota: 9, destacado: 9 > 15 },
      ],
    };
    renderView("students.hbs", data, res);

  } else {
    res.statusCode = 404;
    res.end("<h1>404 - Página no encontrada</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});