require('dotenv').config();
const express = require('express');
const app = express();
const reportRoutes = require('./routes/reportRoutes');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`Reports Service corriendo en http://localhost:${PORT}`);
});
