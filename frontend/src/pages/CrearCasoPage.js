import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './CrearCasoPage.css';

const CrearCasoPage = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_CASES}/casos`,
        { titulo, descripcion },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMensaje(res.data.mensaje);
      setTitulo('');
      setDescripcion('');
    } catch (err) {
      console.error('Error al registrar el caso:', err);
      setError('Error al registrar el caso');
    }
  };

  return (
    <>
      <Navbar />
      <div className="crear-container">
        <form className="crear-form" onSubmit={handleSubmit}>
          <h2>Crear Nuevo Caso</h2>

          <input
            type="text"
            placeholder="Título del caso"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <textarea
            placeholder="Descripción del caso"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="4"
            required
          />

          {mensaje && <div className="crear-msg success">{mensaje}</div>}
          {error && <div className="crear-msg error">{error}</div>}
          <button type="submit">Registrar Caso</button>
        </form>
      </div>
    </>
  );
};

export default CrearCasoPage;
