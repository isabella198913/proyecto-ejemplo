const JwtStrategy = require('passport-jwt').Strategy; // Estrategia de autenticación con JWT
const ExtractJwt = require('passport-jwt').ExtractJwt;        // Herramienta para extraer el token del header
const passport = require('passport');                          // Librería de autenticación
const Keys = require('./keys');                                // Importa la clave secreta
const User = require('../models/user');                        // Importa el modelo de usuario

const ExtractJwt = require('passport-jwt').ExtractJwt; 
const passport = require('passport');                          
const Keys = require('./keys');                                
const User = require('../models/user');                        
const passport = require('passport');
const Keys = require('./keys');
const User = require('../models/user');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //// Extrae el token del header Authorization (el JWT que pones en Postman)
  secretOrKey: Keys.secretOrKey //clave para verificar que el token es autentico//
};

// Registra la estrategia JWT en passport
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  // jwt_payload contiene los datos del usuario guardados dentro del token (id, email, role)
  User.findById(jwt_payload.id, (err, user) => {  // Busca el usuario en la base de datos con el id del token
    if (err) {
      return done(err, false);   // Si hay error en la consulta, rechaza
    }
    if (user) {
      return done(null, user);   // Si el usuario existe, lo autentica y lo deja pasar
    }
    else {
      return done(null, false);  // Si el usuario no existe, rechaza la petición
    }
  });
}));

module.exports = passport;
