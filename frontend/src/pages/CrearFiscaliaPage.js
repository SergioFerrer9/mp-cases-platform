import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './CrearFiscaliaPage.css';

const CrearFiscaliaPage = () => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      await axios.post(`${process.env.REACT_APP_API_AUTH}/fiscalias`, 
        { nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje('Fiscalía creada exitosamente');
      setNombre('');
    } catch (err) {
      setMensaje('Error al crear fiscalía');
    }
  };

  return (
    <>
      <Navbar />
      <div className="crear-fiscalia-container">
        <h2>Crear Nueva Fiscalía</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la fiscalía"
            required
          />
          <button type="submit">Crear</button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </>
  );
};

export default CrearFiscaliaPage;
