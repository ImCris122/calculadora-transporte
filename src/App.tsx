

import { useState, useEffect } from 'react';
import './App.css';
import { resolverVogel } from './hooks/vogel' ; 
import type { VogelStep } from './hooks/vogel';
import ResultsDisplay from './hooks/ResultsDisplay'; 
import StepsDisplay from './hooks/StepsDisplay';



type Matrix = (number | string)[][];
type Vector = (number | string)[];

function App() {
 
  const [origenes, setOrigenes] = useState(3);
  const [destinos, setDestinos] = useState(4);

  
  const [costos, setCostos] = useState<Matrix>([]);
  const [oferta, setOferta] = useState<Vector>([]);
  const [demanda, setDemanda] = useState<Vector>([]);

  
  const [resultado, setResultado] = useState<{ asignaciones: number[][]; costoTotal: number; steps: VogelStep[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    
    const nuevosCostos = Array(origenes).fill(0).map(() => Array(destinos).fill(''));
    setCostos(nuevosCostos);

    
    setOferta(Array(origenes).fill(''));
    setDemanda(Array(destinos).fill(''));
    
    
    setResultado(null); 
  }, [origenes, destinos]);

  

  
  const handleCostoChange = (val: string, i: number, j: number) => {
    
    const nuevosCostos = [...costos];
    nuevosCostos[i][j] = val;
    setCostos(nuevosCostos);
  };

  
  const handleOfertaChange = (val: string, i: number) => {
    const nuevaOferta = [...oferta];
    nuevaOferta[i] = val;
    setOferta(nuevaOferta);
  };
  
  
  const handleDemandaChange = (val: string, i: number) => {
    const nuevaDemanda = [...demanda];
    nuevaDemanda[i] = val;
    setDemanda(nuevaDemanda);
  };

 
  const handleCalcular = () => {
    setResultado(null);
    setError(null);

    
    try {
      const costosNum = costos.map(fila => fila.map(celda => {
        if (celda === '') throw new Error('Todos los campos de costo deben ser llenados.');
        return parseFloat(celda as string);
      }));
      const ofertaNum = oferta.map(val => {
        if (val === '') throw new Error('Todos los campos de oferta deben ser llenados.');
        return parseFloat(val as string);
      });
      const demandaNum = demanda.map(val => {
        if (val === '') throw new Error('Todos los campos de demanda deben ser llenados.');
        return parseFloat(val as string);
      });

      
      const totalOferta = ofertaNum.reduce((sum, val) => sum + val, 0);
      const totalDemanda = demandaNum.reduce((sum, val) => sum + val, 0);

      if (totalOferta !== totalDemanda) {
        throw new Error(`Desbalance: La oferta total (${totalOferta}) no es igual a la demanda total (${totalDemanda}).`);
      }

     
      const res = resolverVogel(costosNum, ofertaNum, demandaNum);
      setResultado(res);

    } catch (e: any) {
      setError(e.message);
    }
  };


  return (
    <div className="App">
      <div className="card">
        <h2>1. Configuración del Modelo</h2>
        <div className="dimension-controls">
          <label>
            Orígenes (Filas):
            <input type="number" min="1" value={origenes} onChange={(e) => setOrigenes(parseInt(e.target.value, 10))} />
          </label>
          <label>
            Destinos (Columnas):
            <input type="number" min="1" value={destinos} onChange={(e) => setDestinos(parseInt(e.target.value, 10))} />
          </label>
        </div>
      </div>

      <div className="card">
        <h2>2. Ingreso de Datos</h2>
        <div className="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Origen/Destino</th>
                {Array(destinos).fill(0).map((_, j) => <th key={j}>Destino {j + 1}</th>)}
                <th>Oferta</th>
              </tr>
            </thead>
            <tbody>
              {Array(origenes).fill(0).map((_, i) => (
                <tr key={i}>
                  <th>Origen {i + 1}</th>
                  {Array(destinos).fill(0).map((_, j) => (
                    <td key={j}>
                      <input
                        type="number"
                        className="grid-input"
                        value={costos[i]?.[j] ?? ''}
                        onChange={(e) => handleCostoChange(e.target.value, i, j)}
                        placeholder={`Costo ${i+1}-${j+1}`}
                      />
                    </td>
                  ))}
                  <td>
                    <input
                      type="number"
                      className="oferta-demanda-input"
                      value={oferta[i] ?? ''}
                      onChange={(e) => handleOfertaChange(e.target.value, i)}
                      placeholder="Oferta"
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <th>Demanda</th>
                {Array(destinos).fill(0).map((_, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      className="oferta-demanda-input"
                      value={demanda[j] ?? ''}
                      onChange={(e) => handleDemandaChange(e.target.value, j)}
                      placeholder="Demanda"
                    />
                  </td>
                ))}
                <td className="total-cell">
                    <button onClick={handleCalcular}>Calcular</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <div className="card error-card">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {resultado && (
        <div className="card result-card">
          <ResultsDisplay
            asignaciones={resultado.asignaciones}
            costoTotal={resultado.costoTotal}
          />
          {resultado && resultado.steps && (
          <StepsDisplay steps={resultado.steps} costos={costos} />
          )}
        </div>
        
      )}
    </div>
  );
}

export default App;