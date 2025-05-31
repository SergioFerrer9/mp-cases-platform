const { poolPromise, sql } = require('../db/sql');

exports.listarUsuarios = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().execute('sp_listar_usuarios');
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al listar usuarios:', err);
      res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
  };
  
  exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol, fiscalia_id } = req.body;
  
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.NVarChar, nombre)
        .input('correo', sql.NVarChar, correo)
        .input('rol', sql.NVarChar, rol)
        .input('fiscalia_id', sql.Int, fiscalia_id)
        .execute('sp_actualizar_usuario');
  
      res.json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      res.status(500).json({ mensaje: 'Error al actualizar usuario' });
    }
  };
  