import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // estilos personalizados

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_AUTH}/auth/login`, {
        correo,
        clave
      });

      const token = res.data.token;
      const userData = jwtDecode(token);


      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/casos');
    } catch (err) {
      setError('Credenciales inválidas o error de servidor');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Ingreso al Sistema de Casos</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        {error && <div className="login-error">{error}</div>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;
