const express = require('express');
const router = express.Router();
const { listarUsuarios, actualizarUsuario } = require('../controllers/usuarioController');
const { verifyAdmin } = require('../utils/jwt');

router.get('/', verifyAdmin, listarUsuarios);
router.put('/:id', verifyAdmin, actualizarUsuario);

module.exports = router;
