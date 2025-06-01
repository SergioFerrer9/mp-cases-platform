const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../db/sql');

exports.login = async (req, res) => {
  const { correo, clave } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('correo', sql.NVarChar, correo)
      .execute('sp_obtener_usuario_por_correo');

    const usuario = result.recordset[0];
    if (!usuario) return res.status(401).json({ mensaje: 'Credenciales invalidas' });

    // comparar clave
    const match = await bcrypt.compare(clave, usuario.clave);
    if (!match) return res.status(401).json({ mensaje: 'clave incorrecta' });

    // generar token
    const token = jwt.sign({
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol
    }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.register = async (req, res) => {
    const { nombre, correo, clave, rol, fiscalia_id } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(clave, 10);
      const pool = await poolPromise;
  
      await pool
        .request()
        .input('nombre', sql.NVarChar, nombre)
        .input('correo', sql.NVarChar, correo)
        .input('clave', sql.NVarChar, hashedPassword)
        .input('rol', sql.NVarChar, rol)
        .input('fiscalia_id', sql.Int, fiscalia_id)
        .execute('sp_crear_usuario');
  
      res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
  
    } catch (err) {
      console.error('Error al registrar usuario:');
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  };
  