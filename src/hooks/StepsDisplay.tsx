

import React from 'react';
import type { VogelStep } from './vogel';

interface StepsDisplayProps {
  steps: VogelStep[];
  costos: (number | string)[][];
}

const StepsDisplay: React.FC<StepsDisplayProps> = ({ steps, costos }) => {
  return (
    <div className="steps-container">
      <h2>Procedimiento Paso a Paso</h2>
      {steps.map((step) => (
        <div key={step.iteracion} className="card step-card">
          <h3>Paso {step.iteracion}</h3>
          <p className="step-description">{step.descripcion}</p>
          <div className="tabla-container">
            <table>
              <thead>
                <tr>
                  <th>Origen/Destino</th>
                  {step.demanda.map((_, j) => <th key={j}>Destino {j + 1}</th>)}
                  <th>Oferta</th>
                  <th>Penalización Fila</th>
                </tr>
              </thead>
              <tbody>
                {step.asignaciones.map((fila, i) => (
                  <tr key={i} className={step.oferta[i] === 0 ? 'satisfecho' : ''}>
                    <th>Origen {i + 1}</th>
                    {fila.map((asignacion, j) => (
                      <td key={j} className={step.demanda[j] === 0 ? 'satisfecho' : ''}>
                        <span className="costo-label">{costos[i][j]}</span>
                        <span className="asignacion-label">{asignacion > 0 ? asignacion : ''}</span>
                      </td>
                    ))}
                    <td className="oferta-demanda-cell">{step.oferta[i]}</td>
                    <td className="penalizacion-cell">{step.penalizacionesFila[i]?.toFixed(2) ?? '–'}</td>
                  </tr>
                ))}
                <tr>
                  <th>Demanda</th>
                  {step.demanda.map((val, j) => <td key={j} className="oferta-demanda-cell">{val}</td>)}
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th>Penalización Col.</th>
                  {step.penalizacionesColumna.map((val, j) => <td key={j} className="penalizacion-cell">{val?.toFixed(2) ?? '–'}</td>)}
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepsDisplay;