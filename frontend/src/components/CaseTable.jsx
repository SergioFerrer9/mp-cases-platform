// src/components/CaseTable.jsx
import React from 'react';
// Asumiendo que moverás el CSS específico de la tabla aquí o lo mantendrás general
import './CaseTable.css'; // Crea este archivo o renombra el anterior

/**
 * Renderiza una tabla de casos.
 * @param {object} props - Las propiedades del componente.
 * @param {Array<object>} props.cases - Un array de objetos de caso para mostrar.
 * @param {boolean} props.editable - Si es verdadero, muestra un menú desplegable para cambiar el estado.
 * @param {function} props.onEstadoChange - Función de callback para los cambios de estado.
 */
const CaseTable = ({ cases, editable, onEstadoChange }) => {
  if (!cases || cases.length === 0) {
    return <p>No hay casos para mostrar.</p>;
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla-casos">
        <thead>
          <tr>
            <th>Título 1</th>
            <th>Descripción</th>
            <th>Fiscalía</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(caso => (
            <tr key={caso.id}>
              <td>{caso.titulo}</td>
              <td>{caso.descripcion}</td>
              <td>{caso.fiscalia}</td>
              <td>
                {editable ? (
                  <select
                    value={caso.estado}
                    onChange={(e) => onEstadoChange(caso.id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="progreso">En Proceso</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                ) : (
                  caso.estado
                )}
              </td>
              <td>{new Date(caso.fecha_creacion).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseTable;