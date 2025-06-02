import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './CasosPage.css';

const CasosPage = () => {
  const [casosActivos, setCasosActivos] = useState([]);
  const [casosCerrados, setCasosCerrados] = useState([]);
  const [vista, setVista] = useState('activos');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchCasos = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_CASES}/casos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const activos = res.data.filter(c => c.estado !== 'cerrado');
      const cerrados = res.data.filter(c => c.estado === 'cerrado');
      setCasosActivos(activos);
      setCasosCerrados(cerrados);
    } catch (err) {
      setError('Error al obtener los casos asignados');
    }
  };

  useEffect(() => {
    fetchCasos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleEstadoChange = async (id, nuevoEstado) => {
    if (nuevoEstado === 'cerrado') {
      const confirmacion = window.confirm(
        '¿Está seguro que desea CERRAR este caso? Esta acción no se puede deshacer.'
      );
      if (!confirmacion) return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_CASES}/casos/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCasos();
    } catch (err) {
      setError('Error al actualizar el estado del caso');
    }
  };

  const renderTablaCasos = (casos, editable) => (
    <div className="tabla-contenedor">
      <table className="tabla-casos">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fiscalía</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {casos.map(caso => (
            <tr key={caso.id}>
              <td>{caso.titulo}</td>
              <td>{caso.descripcion}</td>
              <td>{caso.fiscalia}</td>
              <td>
                {editable ? (
                  <select
                    value={caso.estado}
                    onChange={(e) => handleEstadoChange(caso.id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="progreso">En Proceso</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                ) : (
                  caso.estado
                )}
              </td>
              <td>{new Date(caso.fecha_creacion).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  return (
    <>
      <Navbar />
      <div className="casos-container">
        <div className="casos-header">
          <h2>Casos Asignados</h2>
        </div>

        <div className="tabs">
          <button
            className={vista === 'activos' ? 'tab-active' : ''}
            onClick={() => setVista('activos')}
          >
            Activos
          </button>
          <button
            className={vista === 'cerrados' ? 'tab-active' : ''}
            onClick={() => setVista('cerrados')}
          >
            Historial Cerrados
          </button>
        </div>

        {error && <div className="casos-error">{error}</div>}

        {vista === 'activos' &&
          (casosActivos.length > 0 ? renderTablaCasos(casosActivos, true) : <p>No hay casos activos.</p>)}

        {vista === 'cerrados' &&
          (casosCerrados.length > 0 ? renderTablaCasos(casosCerrados, false) : <p>No hay casos cerrados.</p>)}
      </div>
    </>
  );
};

export default CasosPage;
