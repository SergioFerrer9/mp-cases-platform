require('dotenv').config();
const express = require('express');
const app = express();
const caseRoutes = require('./routes/caseRoutes');
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use('/api/casos', caseRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Cases Service corriendo en http://localhost:${PORT}`);
});
