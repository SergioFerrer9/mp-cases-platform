const express = require('express');
const router = express.Router();
const { obtenerEstadisticas, casosPorFiscalia } = require('../controllers/reportController');
const { verifyToken } = require('../utils/jwt');

router.get('/estadisticas', verifyToken, obtenerEstadisticas);
router.get('/fiscalias', verifyToken, casosPorFiscalia); 
module.exports = router;
