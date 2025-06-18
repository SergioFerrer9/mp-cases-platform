import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useAuthToken from './useAuthToken'; 

const useCasesData = () => {
  const [casosActivos, setCasosActivos] = useState([]);
  const [casosCerrados, setCasosCerrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = useAuthToken();

  const fetchCasos = useCallback(async () => {
    if (!token) {
      setError('No hay token de autenticación disponible.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(''); 
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
      console.error("Error al obtener los casos:", err); 
      setError('Error al obtener los casos asignados. Intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [token]); 

  useEffect(() => {
    fetchCasos();
  }, [fetchCasos]);

  const handleEstadoChange = async (id, nuevoEstado) => {
    if (!token) {
      setError('No hay token de autenticación para actualizar el caso.');
      return;
    }

    if (nuevoEstado === 'cerrado') {
      const confirmacion = window.confirm(
        '¿Está seguro que desea CERRAR este caso? Esta acción no se puede deshacer.'
      );
      if (!confirmacion) return;
    }

    setError(''); 
    try {
      await axios.put(
        `${process.env.REACT_APP_API_CASES}/casos/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCasos();
    } catch (err) {
      console.error("Error al actualizar el estado del caso:", err);
      setError('Error al actualizar el estado del caso. Por favor, intente de nuevo.');
    }
  };

  return {
    casosActivos,
    casosCerrados,
    loading,
    error,
    handleEstadoChange,
    refetchCasos: fetchCasos 
  };
};

export default useCasesData;