const fs = require('fs');

const readable = fs.createReadStream('entrada.txt');
const writable = fs.createWriteStream('salida.txt');

readable.on('data', chunk => {
    if (!writable.write(chunk)) {
        readable.pause();
    }
});

writable.on('drain', () => readable.resume());

readable.on('end', () => {
    console.log('Lectura y escritura manual finalizada.');
    writable.end();
})

// Actividad 1: Lectura con Streams
//const readable = fs.createReadStream('datos.txt', { encoding: 'utf8' });
//readable.on('data', chunk => console.log('Fragmento recibido:', chunk));
//readable.on('end', () => console.log('Lectura completa'));
//readable.on('error', err => console.error('Error:', err));

// Actividad 2: Escritura con Streams
//const writable = fs.createWriteStream('salida.txt');
//writable.write('Este es un mensaje de prueba.\n');
//writable.end('Fin del mensaje.');
//writable.on('finish', () => console.log('Escritura completada.'));

// Actividad 3: Compresión con Pipes
//const zlib = require('zlib');
//const readStream = fs.createReadStream('entrada.txt');
//const writeStream = fs.createWriteStream('entrada.txt.gz');
//const gzip = zlib.createGzip();
//readStream.pipe(gzip).pipe(writeStream);

// Actividad 4: Manejo de Errores y Backpressure