require('dotenv').config();
const express = require('express');
const app = express();
const reportRoutes = require('./routes/reportRoutes');

app.use(express.json());
app.use('/api/reportes', reportRoutes);

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`Reports Service corriendo en http://localhost:${PORT}`);
});
