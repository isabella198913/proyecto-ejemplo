require('dotenv').config(); //carga las variables del archivo .env//
       
module.exports = {
  secretOrKey: process.env.JWT_SECRET // // Exporta la clave secreta para firmar/verificar tokens JWT//
};