/* Script de la base de datos del proyecto*/
/*Define la estructura de la base de datos  */


--Elimina la base de datos si ya existe --
DROP DATABASE IF EXISTS db_node;
--Crea la base de datos con codificacion UTF8 para que soporte caracteres especiales--
CREATE SCHEMA db_node DEFAULT CHARACTER SET utf8 ;
--selecciona la base de datos para trabajar con ella--
USE db_node;

--crea la tabla de usuarios con todos sus campos--
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  image VARCHAR(255),
  role VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--inserta un usuario administrador inicial para el sistema--
INSERT INTO users VALUES (
  null,
  "Albeiro",
  "Ramos",
  "profealbeiro2020@gmail.com",
  "$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G",
  "3103103101", --Contraseña encriptada con bcript--
  "profile",
  "admin",
  null,
  null
);