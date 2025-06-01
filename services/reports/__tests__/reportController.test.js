const request = require('supertest');
const express = require('express');
const reportRoutes = require('../routes/reportRoutes');
const authRoutes = require('../../auth/routes/authRoutes'); // para login
const { poolPromise } = require('../db/sql');

const app = express();
app.use(express.json());
app.use('/api/reportes', reportRoutes);
app.use('/api/auth', authRoutes);

let adminToken;

beforeAll(async () => {
  // Autenticarse como admin
  const login = await request(app)
    .post('/api/auth/login')
    .send({ correo: 'ferrer@gmail.com', clave: 'clave741' });

  adminToken = login.body.token;
});

afterAll(async () => {
  const pool = await poolPromise;
  await pool.close();
});

describe('GET /api/reportes/estadisticas', () => {
  it('debe rechazar sin token', async () => {
    const res = await request(app).get('/api/reportes/estadisticas');
    expect(res.statusCode).toBe(401);
  });

  it('debe retornar estadísticas correctamente con token', async () => {
    const res = await request(app)
      .get('/api/reportes/estadisticas')
      .set('Authorization', `Bearer ${adminToken}`);
  
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(item => {
      expect(item).toHaveProperty('estado');
      expect(item).toHaveProperty('total');
    });
  });
});
