// src/pages/cases/CasosPage.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import CaseTable from '../../components/CaseTable';     // Importa el nuevo componente CaseTable
import useCasesData from '../../hooks/useCasesData';   // Importa el nuevo hook useCasesData
import './CasosPage.css'; // Estilos específicos de la página

const CasosPage = () => {
  const [vista, setVista] = useState('activos');

  // Usa el custom hook para obtener todos los datos y funciones relacionados con los casos
  const {
    casosActivos,
    casosCerrados,
    loading,
    error,
    handleEstadoChange // Esta función ahora la proporciona el hook
  } = useCasesData(); // Llama al custom hook

  return (
    <>
      <Navbar />
      <div className="casos-container">
        <div className="casos-header">
          <h2>Listado de Casos Asignados</h2>
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

        {/* Solo renderiza las tablas si no está cargando y no hay un error crítico */}
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
              editable={false} // Los casos cerrados no son editables
              onEstadoChange={handleEstadoChange} // Todavía se pasa, pero `editable` maneja su uso
            />
          )
        )}
      </div>
    </>
  );
};

export default CasosPage;