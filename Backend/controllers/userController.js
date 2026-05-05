const User = require("../models/user");      // Importa el modelo para hacer consultas a la BD
const bcrypt = require("bcryptjs");          // Para comparar contraseñas encriptadas
const jwt = require("jsonwebtoken");         // Para generar el token de sesión
const keys = require("../config/keys");      // Para usar la clave secreta del JWT


module.exports = {
  // FUNCIÓN 1: login
// Recibe email y password, verifica que existan y que la contraseña sea correcta,
// genera un token JWT válido por 1 hora y lo devuelve con los datos del usuario
  login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, async (err, myUser) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al consultar el usuario",
          error: err,
        });
      }

      if (!myUser) {
        return res.status(401).json({
          success: false,
          message: "El email no existe en la base de datos",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, myUser.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: myUser.id, email: myUser.email, role: myUser.role },
          keys.secretOrKey,
          { expiresIn: "1h" }
        );

        const data = {
          id: myUser.id,
          email: myUser.email,
          name: myUser.name,
          lastname: myUser.lastname,
          image: myUser.image,
          phone: myUser.phone,
          role: myUser.role,
          session_token: `JWT ${token}`,
        };

        return res.status(201).json({
          success: true,
          message: "Usuario autenticado",
          data: data,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Contraseña o correo incorrecto",
        });
      }
    });
  },

  getAllUsers(req, res) {
    //FUNCIÓN 2: getAllUsers
// Llama a User.findAll() y devuelve la lista completa de usuarios 
    User.findAll((err, users) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al listar usuarios",
          error: err,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Lista de usuarios",
        data: users,
      });
    });
  },
 // FUNCIÓN 3: getUserById
// Toma el id de la URL (req.params.id), busca ese usuario,
// si no existe responde 404, si existe lo devuelve
  getUserById(req, res) {
    const id = req.params.id;
    User.findById(id, (err, user) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al consultar el usuario",
          error: err,
        });
      }
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Usuario encontrado",
        data: user,
      });
    });
  },

  // FUNCIÓN 4: register
// Toma los datos del body, si no viene rol asigna "user" por defecto,
// llama a User.create() y devuelve el usuario creado
  register(req, res) {
    const user = req.body;

    if (!user.role) {
      user.role = "user";
    }

    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al crear al usuario",
          error: err,
        });
      } else {
        return res.status(201).json({
          success: true,
          message: "Usuario creado correctamente",
          data: data,
        });
      }
    });
  },

  // FUNCIÓN 5: getUserUpdate
// Toma los datos del body y llama a User.update() para actualizar el usuario
  getUserUpdate(req, res) {
    const user = req.body;
    User.update(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al actualizar el usuario",
          error: err,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Usuario actualizado",
        data: data,
      });
    });
  },

  getUserDelete(req, res) {
    // FUNCIÓN 6: getUserDelete
// Toma el id de la URL y llama a User.delete() para eliminar ese usuario
    const id = req.params.id;
    User.delete(id, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Error al eliminar el usuario",
          error: err,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Usuario eliminado",
        data: data,
      });
    });
  },
};