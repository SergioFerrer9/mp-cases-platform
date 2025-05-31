require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const fiscaliaRoutes = require('./routes/fiscaliaRoutes');

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/fiscalia', fiscaliaRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Auth Service en http://localhost:${PORT}`));
