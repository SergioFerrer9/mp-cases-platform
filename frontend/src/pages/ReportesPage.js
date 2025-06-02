import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import Navbar from '../components/Navbar';
import './ReportesPage.css';

const ReportesPage = () => {
  const [porEstado, setPorEstado] = useState([]);
  const [porFiscalia, setPorFiscalia] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resEstado, resFiscalia] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_REPORTS}/reportes/estadisticas`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_REPORTS}/reportes/fiscalias`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPorEstado(resEstado.data.map(item => ({
          categoria: item.estado.toUpperCase(),
          total: item.total
        })));

        setPorFiscalia(resFiscalia.data.map(item => ({
          categoria: item.fiscalia,
          total: item.total
        })));
      } catch (err) {
        console.error('Error al obtener estadísticas:', err);
        setError('No se pudieron obtener las estadísticas');
      }
    };

    fetchDatos();
  }, [token]);

// ... (importaciones y setup anteriores)

const renderGrafica = (titulo, data, color = '#0077cc') => (
  <>
    <h3>{titulo}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="categoria" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="total" fill={color} />
      </BarChart>
    </ResponsiveContainer>
  </>
);

return (
  <>
    <Navbar />
    <div className="reportes-container">
      <h2>Estadísticas de Casos</h2>
      {error && <p className="error">{error}</p>}

      {porEstado.length > 0 && renderGrafica('Casos por Estado', porEstado)}
      {porFiscalia.length > 0 && renderGrafica('Casos por Fiscalía', porFiscalia, '#00b894')}
    </div>
  </>
);

};

export default ReportesPage;
