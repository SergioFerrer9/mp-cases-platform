const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const { poolPromise } = require('../db/sql');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Pruebas del controlador authController', () => {
  describe('POST /api/auth/login', () => {
    it('debe rechazar credenciales inválidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ correo: 'no@existe.com', clave: 'invalida' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('mensaje', 'Credenciales invalidas');
    });

    it('debe iniciar sesión correctamente con credenciales válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ correo: 'ferrer@gmail.com', clave: 'clave741' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});

afterAll(async () => {
    const pool = await poolPromise;
    await pool.close();
  });