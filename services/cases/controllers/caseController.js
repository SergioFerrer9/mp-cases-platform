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
  
  exports.reasignarCaso = async (req, res) => {
    const { id } = req.params;
    const { nuevo_fiscal_id } = req.body;
    const usuario_origen_id = req.user.id;
  
    try {
      const pool = await poolPromise;
  
      // 1. Obtener datos del caso actual
      const casoResult = await pool
        .request()
        .input('caso_id', sql.Int, id)
        .query('SELECT * FROM Caso WHERE id = @caso_id');
  
      const caso = casoResult.recordset[0];
      if (!caso) return res.status(404).json({ mensaje: 'Caso no encontrado' });
  
      if (caso.estado !== 'pendiente') {
        return res.status(400).json({ mensaje: 'Solo se pueden reasignar casos en estado pendiente' });
      }
  
      // 2. Verificar que ambos fiscales estén en la misma fiscalía
      const usuariosResult = await pool
        .request()
        .input('uid1', sql.Int, usuario_origen_id)
        .input('uid2', sql.Int, nuevo_fiscal_id)
        .query(`
          SELECT u1.fiscalia_id AS f1, u2.fiscalia_id AS f2
          FROM Usuario u1
          JOIN Usuario u2 ON 1=1
          WHERE u1.id = @uid1 AND u2.id = @uid2
        `);
  
      const { f1, f2 } = usuariosResult.recordset[0];
      if (f1 !== f2) {
        // Registrar intento fallido
        await pool.request()
          .input('caso_id', sql.Int, id)
          .input('usuario_origen_id', sql.Int, usuario_origen_id)
          .input('usuario_destino_id', sql.Int, nuevo_fiscal_id)
          .input('razon', sql.NVarChar, 'Fiscalías diferentes')
          .query(`
            INSERT INTO LogIntentoFallido (caso_id, usuario_origen_id, usuario_destino_id, razon)
            VALUES (@caso_id, @usuario_origen_id, @usuario_destino_id, @razon);
          `);
  
        return res.status(403).json({ mensaje: 'No se puede reasignar a fiscales de distinta fiscalía' });
      }
  
      // 3. Reasignar el caso
      await pool.request()
        .input('caso_id', sql.Int, id)
        .input('nuevo_fiscal_id', sql.Int, nuevo_fiscal_id)
        .execute('sp_reasignar_caso');
        
      res.json({ mensaje: 'Caso reasignado correctamente' });
  
    } catch (err) {
      console.error('Error al reasignar caso:', err);
      res.status(500).json({ mensaje: 'Error al reasignar caso' });
    }
  };

  exports.verLogs = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT 
          l.id,
          l.fecha,
          l.razon,
          c.titulo AS caso,
          u1.nombre AS usuario_origen,
          u2.nombre AS usuario_destino
        FROM LogIntentoFallido l
        INNER JOIN Caso c ON l.caso_id = c.id
        INNER JOIN Usuario u1 ON l.usuario_origen_id = u1.id
        INNER JOIN Usuario u2 ON l.usuario_destino_id = u2.id
        ORDER BY l.fecha DESC
      `);
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al obtener logs:', err);
      res.status(500).json({ mensaje: 'Error al obtener los logs' });
    }
  };
  
  exports.obtenerCasoPorId = async (req, res) => {
    const { id } = req.params;
    const fiscal_id = req.user.id;
  
    try {
      const pool = await poolPromise;
  
      const result = await pool
        .request()
        .input('caso_id', sql.Int, id)
        .query(`
          SELECT * FROM Caso
          WHERE id = @caso_id AND fiscal_id = ${fiscal_id}
        `);
  
      const caso = result.recordset[0];
  
      if (!caso) {
        return res.status(404).json({ mensaje: 'Caso no encontrado o acceso no autorizado' });
      }
  
      res.json(caso);
  
    } catch (err) {
      console.error('Error al obtener caso:', err);
      res.status(500).json({ mensaje: 'Error al consultar el caso' });
    }
  };
  
  exports.actualizarEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
  
    if (!['pendiente', 'progreso', 'cerrado'].includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado inválido' });
    }
  
    try {
      const pool = await poolPromise;
      await pool
        .request()
        .input('id', sql.Int, id)
        .input('estado', sql.NVarChar, estado)
        .query('UPDATE Caso SET estado = @estado WHERE id = @id');
  
      res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (err) {
      console.error('Error al actualizar estado del caso:', err);
      res.status(500).json({ mensaje: 'Error interno al actualizar el estado' });
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
