const express = require('express');
const router = express.Router();
const { crearCaso, listarCasos, reasignarCaso, verLogs, obtenerCasoPorId } = require('../controllers/caseController');
const { verifyToken } = require('../utils/jwt');

router.post('/', verifyToken, crearCaso);
router.get('/', verifyToken, listarCasos);
router.put('/:id/reasignar', verifyToken, reasignarCaso);
router.get('/logs', verifyToken, verLogs);
router.get('/:id', verifyToken, obtenerCasoPorId); 

module.exports = router;
