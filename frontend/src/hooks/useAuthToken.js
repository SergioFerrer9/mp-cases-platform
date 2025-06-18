import { useState, useEffect } from 'react';

const useAuthToken = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }

  }, []); 

  return token;
};

export default useAuthToken;