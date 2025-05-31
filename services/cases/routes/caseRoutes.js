const express = require('express');
const router = express.Router();
const { crearCaso, listarCasos } = require('../controllers/caseController');
const { verifyToken } = require('../utils/jwt');

router.post('/', verifyToken, crearCaso);
router.get('/', verifyToken, listarCasos);

module.exports = router;
