import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    clave: '',
    rol: 'fiscal',
    fiscalia_id: 1
  });

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_AUTH}/auth/register`, formData);
      setMensaje(res.data.mensaje || 'Usuario registrado con éxito');
      setError('');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar usuario');
      setMensaje('');
    }
  };

  return (
    <div className="auth-container">
      <h2>Registro de Usuario</h2>
      {error && <div className="auth-error">{error}</div>}
      {mensaje && <div className="auth-success">{mensaje}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="clave"
          placeholder="Clave"
          value={formData.clave}
          onChange={handleChange}
          required
        />
        <select name="rol" value={formData.rol} onChange={handleChange}>
          <option value="fiscal">Fiscal</option>
          <option value="admin">Administrador</option>
        </select>
        <input
          type="number"
          name="fiscalia_id"
          placeholder="ID Fiscalía"
          value={formData.fiscalia_id}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrar</button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'underline', color: '#007bff' }}>
          Volver al Login
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
