const request = require('supertest');
const express = require('express');
const usuarioRoutes = require('../routes/usuarioRoutes');
const authRoutes = require('../routes/authRoutes');
const { poolPromise } = require('../db/sql');

const app = express();
app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);

let adminToken;

beforeAll(async () => {
  // Obtener token de admin real
  const res = await request(app)
    .post('/api/auth/login')
    .send({ correo: 'ferrer@gmail.com', clave: 'clave741' });

  adminToken = res.body.token;
});

afterAll(async () => {
  const pool = await poolPromise;
  await pool.close();
});

describe('GET /api/usuarios', () => {
  it('debe rechazar sin token', async () => {
    const res = await request(app).get('/api/usuarios');
    expect(res.statusCode).toBe(401);
  });

  it('debe listar usuarios si es admin', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

it('debe rechazar si el usuario no es admin (fiscal)', async () => {
    // Crear un nuevo usuario con rol fiscal si no existe
    const registro = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Fiscal de Prueba',
        correo: 'fiscal@ejemplo.com',
        clave: 'clave741',
        rol: 'fiscal',
        fiscalia_id: 1
      });
  
    // Iniciar sesión con el usuario fiscal
    const login = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'fiscal@ejemplo.com', clave: 'clave741' });
  
    const fiscalToken = login.body.token;
  
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${fiscalToken}`);
  
    expect(res.statusCode).toBe(403);
  });
  