import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import CaseTable from '../../components/CaseTable';     
import useCasesData from '../../hooks/useCasesData';  
import './CasosPage.css';

const CasosPage = () => {
  const [vista, setVista] = useState('activos');

  const {
    casosActivos,
    casosCerrados,
    loading,
    error,
    handleEstadoChange 
  } = useCasesData(); 

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

        {loading && <div className="casos-loading">Cargando casos...</div>}
        {error && <div className="casos-error">{error}</div>}

        {!loading && !error && (
          vista === 'activos' ? (
            <CaseTable
              cases={casosActivos}
              editable={true}
              onEstadoChange={handleEstadoChange}
            />
          ) : (
            <CaseTable
              cases={casosCerrados}
              editable={false} 
              onEstadoChange={handleEstadoChange} 
            />
          )
        )}
      </div>
    </>
  );
};

export default CasosPage;