import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import Navbar from '../components/Navbar';
import './ReportesPage.css';

const ReportesPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_REPORTS}/reportes/estadisticas`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const formattedData = res.data.map(item => ({
          estado: item.estado.toUpperCase(),
          total: item.total
        }));

        setData(formattedData);
      } catch (err) {
        setError('No se pudieron obtener las estadísticas');
      }
    };

    fetchStats();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="reportes-container">
        <h2>Estadísticas de Casos</h2>
        {error && <p className="error">{error}</p>}
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="estado" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#0077cc" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export default ReportesPage;
