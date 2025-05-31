const express = require('express');
const router = express.Router();
const { obtenerEstadisticas } = require('../controllers/reportController');
const { verifyToken } = require('../utils/jwt');

router.get('/estadisticas', verifyToken, obtenerEstadisticas);

module.exports = router;
