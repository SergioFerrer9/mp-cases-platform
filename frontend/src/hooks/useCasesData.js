// src/hooks/useCasesData.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useAuthToken from './useAuthToken'; // Importa el nuevo hook de autenticación

/**
 * Custom hook para obtener y gestionar datos de casos (activos y cerrados).
 * Maneja la carga, errores y la actualización del estado del caso.
 * @returns {object} Un objeto que contiene los datos de los casos, el estado de carga, el mensaje de error y la función de actualización.
 */
const useCasesData = () => {
  const [casosActivos, setCasosActivos] = useState([]);
  const [casosCerrados, setCasosCerrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = useAuthToken(); // Obtiene el token usando nuestro custom hook

  // useCallback memoiza esta función, evitando recreaciones innecesarias
  // lo que ayuda al rendimiento y previene re-ejecuciones de useEffect.
  const fetchCasos = useCallback(async () => {
    if (!token) {
      setError('No hay token de autenticación disponible.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(''); // Limpia errores anteriores
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
      console.error("Error al obtener los casos:", err); // Registra el error completo
      setError('Error al obtener los casos asignados. Intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [token]); // Array de dependencias: Se vuelve a ejecutar fetchCasos si el token cambia

  // Efecto para activar la obtención de datos cuando el componente se monta o fetchCasos cambia
  useEffect(() => {
    fetchCasos();
  }, [fetchCasos]); // `fetchCasos` está envuelto en `useCallback`, por lo que es estable

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

    setError(''); // Limpia errores anteriores
    try {
      await axios.put(
        `${process.env.REACT_APP_API_CASES}/casos/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Vuelve a obtener los casos para actualizar la interfaz de usuario después de un cambio exitoso
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
    refetchCasos: fetchCasos // Expone una forma de volver a obtener manualmente si es necesario
  };
};

export default useCasesData;