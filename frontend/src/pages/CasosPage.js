import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './CasosPage.css';

const CasosPage = () => {
  const [casos, setCasos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_CASES}/casos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCasos(res.data);
      } catch (err) {
        setError('Error al obtener los casos asignados');
      }
    };

    fetchCasos();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="casos-container">
        <div className="casos-header">
          <h2>Casos Asignados</h2>
          <button className="nuevo-caso-btn" onClick={() => navigate('/casos/crear')}>
            + Nuevo Caso
          </button>
        </div>

        {error && <div className="casos-error">{error}</div>}

        {casos.length === 0 ? (
          <p>No hay casos asignados.</p>
        ) : (
          <div className="casos-grid">
            {casos.map(caso => (
              <div className="caso-card" key={caso.id}>
                <h3>{caso.titulo}</h3>
                <p>{caso.descripcion}</p>
                <p><strong>Estado:</strong> {caso.estado}</p>
                <p><strong>Fecha:</strong> {new Date(caso.fecha_creacion).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CasosPage;
