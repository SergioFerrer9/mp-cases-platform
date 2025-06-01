const express = require('express');
const router = express.Router();
const { crearFiscalia, listarFiscalias } = require('../controllers/fiscaliaController');
const { verifyAdmin } = require('../utils/jwt');

router.post('/', verifyAdmin, crearFiscalia);
router.get('/', verifyAdmin, listarFiscalias);  // proteger con admin

module.exports = router;
