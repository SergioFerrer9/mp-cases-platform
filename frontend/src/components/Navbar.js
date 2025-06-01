import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 onClick={() => navigate('/casos')} style={{ cursor: 'pointer' }}>
          mp-cases-platform
        </h1>
      </div>
      <div className="navbar-center">
        <button onClick={() => navigate('/casos')} className="nav-btn">Casos</button>
        <button onClick={() => navigate('/casos/crear')} className="nav-btn">+ Nuevo Caso</button>
        <button onClick={() => navigate('/reportes')} className="nav-btn">Reportes</button>
        <button onClick={() => navigate('/fiscalias')} className="nav-btn">Fiscalías</button>
        <button onClick={() => navigate('/fiscalias/crear')} className="nav-btn">+ Crear Fiscalía</button>
      </div>
      <div className="navbar-right">
        <span className="user-info">
          {user?.nombre} <span className="user-role">({user?.rol})</span>
        </span>
        <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;
  