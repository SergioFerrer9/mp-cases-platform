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

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_CASES}/casos/${id}/estado`, 
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Actualiza el estado local
      setCasos(prevCasos => 
        prevCasos.map(caso =>
          caso.id === id ? { ...caso, estado: nuevoEstado } : caso
        )
      );
    } catch (err) {
      setError('Error al actualizar el estado del caso');
    }
  };

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
                <p><strong>Estado:</strong></p>
                <select
                  value={caso.estado}
                  onChange={(e) => handleEstadoChange(caso.id, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="cerrado">Cerrado</option>
                </select>
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
