import React from 'react';

// Solución: Definimos el tipo 'Matrix' aquí mismo.
type Matrix = number[][]; 

interface ResultsDisplayProps {
  asignaciones: Matrix;
  costoTotal: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ asignaciones, costoTotal }) => {
  // ... el resto del código no cambia ...
  return (
    <div className="resultados">
      <h2>Resultados Obtenidos</h2>
      <h3>Matriz de Asignaciones</h3>
      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th></th>
              {asignaciones[0].map((_, index) => <th key={index}>Destino {index + 1}</th>)}
            </tr>
          </thead>
          <tbody>
            {asignaciones.map((fila, i) => (
              <tr key={i}>
                <th>Origen {i + 1}</th>
                {fila.map((asignacion, j) => (
                  <td key={j} className={asignacion > 0 ? 'asignado' : ''}>
                    {asignacion}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <h3>Costo Total Mínimo: ${costoTotal}</h3>
    </div>
  );
};

export default ResultsDisplay;