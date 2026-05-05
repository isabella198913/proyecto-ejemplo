
/* Establece y exporta la conexion de la 
base de datos MYSQL usando las variables del
 .env */ 

require('dotenv').config();/*carga las variable del archivo .env para poder usarlas */

const mysql = require('mysql'); /* Importa el módulo para conectarse a MySQL*/

const db = mysql.createConnection({ // crea la configuracion de la conexion//
  host: process.env.DB_HOST, /*toma el host  del .env (localhost)*/ 
  user: process.env.DB_USER,/*toma el usuario del .env (root)*/ 
  password: process.env.DB_PASSWORD, /*toma la contraseña del .env*/ 
  database: process.env.DB_NAME, /*toma el nombre de la base de datos del .env*/ 
  port: process.env.DB_PORT /*toma el puerto del .env (3306)*/ 

});
db.connect(function(err) { //intenta conectarse con la base de datos //
  if (err) throw err; // si hay error,detiene el servidor y lo mustra//
  console.log('Base de datos conectada') //si conecta muestra el mensaje en consola // 
});
module.exports = db; //exporta la conexion para usarla en otros archivos//
