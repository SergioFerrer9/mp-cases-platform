import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import './FiscaliasPage.css';

const FiscaliasPage = () => {
  const [fiscalias, setFiscalias] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFiscalias = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_AUTH}/fiscalias`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFiscalias(res.data);
      } catch (err) {
        setError('Error al obtener las fiscalías');
      }
    };

    fetchFiscalias();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="fiscalias-container">
        <h2>Fiscalías Registradas</h2>
        {error && <div className="error">{error}</div>}
        <table className="fiscalias-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {fiscalias.map(f => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FiscaliasPage;
