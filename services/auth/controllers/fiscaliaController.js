const { poolPromise, sql } = require('../db/sql');

exports.crearFiscalia = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) return res.status(400).json({ mensaje: 'Nombre requerido' });

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('nombre', sql.NVarChar, nombre)
      .execute('sp_crear_fiscalia');

    res.status(201).json({ mensaje: 'Fiscalía creada exitosamente' });
  } catch (err) {
    console.error('Error al crear fiscalía:', err);
    res.status(500).json({ mensaje: 'Error al crear fiscalía' });
  }
};
