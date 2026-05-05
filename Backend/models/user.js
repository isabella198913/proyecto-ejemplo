 const db = require('../config/config'); // Importa la conexión a la base de datos
const bcrypt = require('bcryptjs');// Importa bcrypt para encriptar contraseñas
const User = {}; // Objeto vacío donde se guardan todas las funciones del modelo

//Funcion 1 : obtener todos los usuarios//
User.findAll = (result) => {
  // Consulta SQL que trae todos los usuarios (sin contraseña por seguridad)
  // Llama a result con error o con la lista de usuarios encontrados
  const sql = `SELECT id, email, name, lastname, phone, image, role, created_at, updated_at FROM users`;
  db.query(sql, (err, users) => {
    if (err) {
      console.log('Error al listar usuarios: ', err);
      result(err, null);
    } else {
      console.log('Usuarios encontrados: ', users.length);
      result(null, users);
    }
  });
};

// FUNCIÓN 2: Buscar un usuario por su ID
User.findById = (id, result) => {
  // Consulta SQL que busca un usuario específico por su id
  // Retorna el primer resultado (user[0])
  const sql = `SELECT id, email, name, lastname, image, phone, role, password FROM users WHERE id = ?`;
  db.query(sql, [id], (err, user) => {
    if (err) {
      console.log('Error al consultar: ', err);
      result(err, null);
    }
    else {
      console.log('Usuario consultado: ',  user[0] );// Muestra el usuario encontrado
      result(null, user[0]);   // Retorna solo el primer resultado (user[0]) ya que el id es único
    }
  });
};

// FUNCIÓN 3: Buscar un usuario por su email

User.findByEmail = (email, result) => {
  const sql = `SELECT id, email, name, lastname, image, phone, role, password FROM users WHERE email = ?`; // Consulta que busca por email, se usa principalmente en el login
  db.query(sql, [email], (err, user) => { // El ? se reemplaza por el email recibido
    if (err) {
      console.log('Error al consultar: ', err); // Muestra el error en consola
      result(err, null);               // Retorna el error
    } else {
      console.log('Usuario consultado: ', user[0]); // Muestra el usuario encontrado
      result(null, user[0]);           // Retorna el primer resultado
    }
  });
};


//FUNCION 4: crear una nuevo usuario//
User.create = async (user, result) => {
  const hash = await bcrypt.hash(user.password, 10);  //Encripta la contraseña con bcrypt (10 = nivel de seguridad) //
  const validRoles = ['admin', 'seller', 'customer', 'user'];
  const role = validRoles.includes(user.role) ? user.role : 'user'; // Si el rol enviado es válido lo usa, si no asigna 'user' por defecto//
  
  //consulta que inserta un nuevo usuario//
  const sql = `INSERT INTO users(
                name, 
                lastname,
                email, 
                password,
                phone,
                image,
                role,
                created_at,
                updated_at
            ) VALUES (?,?,?,?,?,?,?,?,?)`;

  db.query(sql,
    [
      user.name,
      user.lastname,
      user.email,
      hash,
      user.phone,
      user.image,
      role,
      new Date(),      // Fecha de creación (fecha actual)
    new Date()       // Fecha de actualización (igual a la de creación al inicio)
    ], (err, res) => {
      if (err) {
        console.log('Error al crear al Usuario: ', err);// Muestra el error en consola
        result(err, null);//retorna el error();
        //
      } else {
        console.log('Usuario creado: ', {id: res.insertId, ...user}); // Muestra el usuario creado con su nuevo id//
        result(null, {id: res.insertId, ...user}); // Retorna el usuario creado con el id generado automáticamente
      }
    }
  );
};

 // FUNCIÓN 5: Actualizar un usuario existente
User.update = async (user, result) => {
 let fields = []; // Array que guarda los campos a actualizar dinámicamente
  let values = []; // Array que guarda los valores de cada campo


  // Solo agrega los campos que vengan en el body, no actualiza todo
  if (user.password) {
    const hash = await bcrypt.hash(user.password, 10);// Encripta la nueva contraseña
    fields.push("password = ?");  // Agrega el campo al SQL
    values.push(hash);            // Agrega el valor encriptado
  }

  if (user.email) {
    fields.push("email = ?"); //agrega el email al sql si viene en el body //
    values.push(user.email);
  }
  if (user.name) {
    fields.push("name = ?");  // Agrega nombre al SQL si viene en el body
    values.push(user.name);
  }
  if (user.lastname) {
    fields.push("lastname = ?");
    values.push(user.lastname);
  }
  if (user.phone) {
    fields.push("phone = ?");
    values.push(user.phone);
  }
  if (user.image) {
    fields.push("image = ?");
    values.push(user.image);
  }
  if (user.role) {
    fields.push("role = ?");
    values.push(user.role);
  }

  fields.push("updated_at = ?"); // Siempre actualiza la fecha de modificación
  values.push(new Date());        // Fecha actual como valor de updated_at

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`; // Construye el SQL dinámicamente con los campos que vinieron
  values.push(user.id); // Agrega el id al final para el WHERE

  db.query(sql, values, (err, res) => {
    if (err) {
      console.log('Error al actualizar usuario: ', err); // Muestra el error en consola
      result(err, null);                                 // Retorna el error
    } else {
      console.log('Usuario actualizado: ', { id: user.id, ...user }); // Muestra el usuario actualizado
      result(null, { id: user.id, ...user });            // Retorna los datos actualizados
    }
  });
};

// FUNCION 6:eliminar un usuario//
User.delete = (id, result) => {
  const sql = `DELETE FROM users WHERE id = ?`;  // Consulta que elimina el usuario con el id especificado
  db.query(sql, [id], (err, res) => { // El ? se reemplaza por el id recibido
    if (err) {
      console.log('Error al eliminar usuario: ', err); // MUESTRA EL  ERROR POR CONSOLA//
      result(err, null); //Retorna el error//
    } else {
      console.log('Usuario eliminado con id: ', id); // Confirma la eliminación en consola
      result(null, res); // Retorna el resultado de la operación
    }
  });
};

module.exports = User; 