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

exports.casosPorFiscalia = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT f.nombre AS fiscalia, COUNT(*) AS total
      FROM Caso c
      JOIN Usuario u ON c.fiscal_id = u.id
      JOIN Fiscalia f ON u.fiscalia_id = f.id
      GROUP BY f.nombre
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener casos por fiscalía:', err);
    res.status(500).json({ mensaje: 'Error al obtener datos de fiscalías' });
  }
};