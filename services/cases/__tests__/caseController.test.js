const request = require('supertest');
const express = require('express');
const caseRoutes = require('../routes/caseRoutes');
const authRoutes = require('../../auth/routes/authRoutes'); // para login
const { poolPromise } = require('../db/sql');

const app = express();
app.use(express.json());
app.use('/api/casos', caseRoutes);
app.use('/api/auth', authRoutes); // para login

let fiscalToken;
let adminToken;
let idCasoReasignable;

beforeAll(async () => {
  // Login como fiscal
  const loginFiscal = await request(app)
    .post('/api/auth/login')
    .send({ correo: 'fiscal@ejemplo.com', clave: 'clave741' });

  fiscalToken = loginFiscal.body.token;

  // Login como admin
  const loginAdmin = await request(app)
    .post('/api/auth/login')
    .send({ correo: 'ferrer@gmail.com', clave: 'clave741' });

  adminToken = loginAdmin.body.token;

  // Crear un nuevo caso para pruebas de reasignación
  const nuevoCaso = await request(app)
    .post('/api/casos')
    .set('Authorization', `Bearer ${fiscalToken}`)
    .send({
      titulo: 'Caso para reasignar',
      descripcion: 'Este caso será reasignado por el admin'
    });

  idCasoReasignable = nuevoCaso.body.id || 1; // ajustar si no devuelve id
});

afterAll(async () => {
  const pool = await poolPromise;
  await pool.close();
});

describe('POST /api/casos', () => {
  it('debe rechazar si no hay token', async () => {
    const res = await request(app).post('/api/casos').send({});
    expect(res.statusCode).toBe(401);
  });

  it('debe registrar un nuevo caso con usuario autenticado', async () => {
    const res = await request(app)
      .post('/api/casos')
      .set('Authorization', `Bearer ${fiscalToken}`)
      .send({
        titulo: 'Caso de prueba Jest',
        descripcion: 'Este es un caso creado desde una prueba unitaria'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('mensaje', 'Caso registrado exitosamente');
  });
});

describe('GET /api/casos', () => {
  it('debe rechazar si no hay token', async () => {
    const res = await request(app).get('/api/casos');
    expect(res.statusCode).toBe(401);
  });

  it('debe retornar casos del fiscal autenticado', async () => {
    const res = await request(app)
      .get('/api/casos')
      .set('Authorization', `Bearer ${fiscalToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('PUT /api/casos/:id/reasignar', () => {
  it('debe rechazar si no hay token', async () => {
    const res = await request(app)
      .put(`/api/casos/${idCasoReasignable}/reasignar`)
      .send({ nuevo_fiscal_id: 1 });

    expect(res.statusCode).toBe(401);
  });

  it('debe reasignar un caso como admin', async () => {
    const res = await request(app)
      .put(`/api/casos/${idCasoReasignable}/reasignar`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nuevo_fiscal_id: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Caso reasignado correctamente');

  });
});
