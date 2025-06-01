require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const fiscaliaRoutes = require('./routes/fiscaliaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/fiscalias', fiscaliaRoutes);
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Auth Service en http://localhost:${PORT}`));
