const { poolPromise, sql } = require('../db/sql');

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute('sp_estadisticas_por_estado');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas' });
  }
};
