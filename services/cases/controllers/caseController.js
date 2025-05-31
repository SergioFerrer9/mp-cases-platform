const { poolPromise, sql } = require('../db/sql');

exports.crearCaso = async (req, res) => {
  const { titulo, descripcion } = req.body;
  const fiscal_id = req.user.id;

  if (!titulo) return res.status(400).json({ mensaje: 'Titulo requerido' });

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('titulo', sql.NVarChar, titulo)
      .input('descripcion', sql.NVarChar, descripcion || '')
      .input('fiscal_id', sql.Int, fiscal_id)
      .execute('sp_crear_caso');

    res.status(201).json({ mensaje: 'Caso registrado exitosamente' });
  } catch (err) {
    console.error('Error al registrar caso:', err);
    res.status(500).json({ mensaje: 'Error al registrar caso' });
  }
};

exports.listarCasos = async (req, res) => {
    const fiscal_id = req.user.id;
  
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('fiscal_id', sql.Int, fiscal_id)
        .execute('sp_obtener_casos_por_fiscal');
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al listar casos:', err);
      res.status(500).json({ mensaje: 'Error al obtener casos' });
    }
  };
  
