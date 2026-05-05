const http = require('http');        // Módulo nativo de Node para crear el servidor HTTP
const app = require('./server');     // Importa la app ya configurada de server.js
const cors = require('cors');        // Para configurar CORS más detallado
const port = process.env.PORT || 3000;           // Puerto del .env o 3000 por defecto
const host = process.env.HOST || '192.168.80.18'; // IP del .env o la IP local por defecto

// Configura la cors permitiendo solo estos origenes//
app.use(cors({
  origin: [
    'http://192.168.80.18',
    'http://localhost', 
    'http://127.0.0.1'    
  ],
  credentials: true,  // Permite enviar cookies y headers de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //metodos http permitidos//
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] //Headers permitidos //
}));

// Manejar preflight CORS
app.options('*', cors()); // Responde las peticiones preflight (verificación previa del navegador)
app.set('port', port);    // Guarda el puerto en la configuración de la app

const server = http.createServer(app); // Crea el servidor HTTP usando la app de Express

server.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}`); // Enciende el servidor y muestra la dirección en consola
});