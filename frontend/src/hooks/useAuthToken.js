// src/hooks/useAuthToken.js
import { useState, useEffect } from 'react';

/**
 * Custom hook para recuperar el token de autenticación de localStorage.
 * @returns {string | null} El token de autenticación o null si no se encuentra.
 */
const useAuthToken = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    // Podrías añadir lógica aquí para cambios de token en tiempo real si es necesario,
    // por ejemplo, escuchando eventos de almacenamiento. Por simplicidad, lo mantendremos básico.
  }, []); // Se ejecuta solo una vez al montar el componente

  return token;
};

export default useAuthToken;