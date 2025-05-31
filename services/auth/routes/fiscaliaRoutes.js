const express = require('express');
const router = express.Router();
const { crearFiscalia } = require('../controllers/fiscaliaController');

router.post('/', crearFiscalia);

module.exports = router;
