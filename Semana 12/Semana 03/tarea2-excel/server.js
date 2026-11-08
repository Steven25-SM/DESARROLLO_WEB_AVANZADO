const http = require('http');
const ExcelJS = require('exceljs');

const PORT = 3000;

function generarProductos(cantidad) {
  const nombres = ['Laptop', 'Mouse', 'Teclado', 'Monitor', 'Impresora', 'Router', 'Webcam', 'Micrófono', 'Auriculares', 'Tablet'];
  const productos = [];
  for (let i = 1; i <= cantidad; i++) {
    productos.push({
      producto: nombres[i % nombres.length] + ' ' + i,
      cantidad: Math.floor(Math.random() * 50) + 1,
      precio: parseFloat((Math.random() * 500 + 10).toFixed(2))
    });
  }
  return productos;
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/reporte') {
    try {
      const workbook = new ExcelJS.Workbook();
      const hoja = workbook.addWorksheet('Ventas');

      hoja.columns = [
        { header: 'Producto', key: 'producto', width: 25 },
        { header: 'Cantidad', key: 'cantidad', width: 15 },
        { header: 'Precio', key: 'precio', width: 15 }
      ];

      generarProductos(20).forEach(fila => hoja.addRow(fila));

      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="reporte_ventas.xlsx"'
      });

      await workbook.xlsx.write(res); 
      res.end();
    } catch (err) {
      console.error('Error generando el Excel:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error al generar el archivo Excel.');
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Visita /reporte para descargar el Excel');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});