// src/App.tsx

import { useState, useEffect } from 'react';
import './App.css';
import { resolverVogel } from './hooks/vogel' ; // Importaremos la lógica desde otro archivo
import type { VogelStep } from './hooks/vogel';
import ResultsDisplay from './hooks/ResultsDisplay'; // Reutilizamos el componente de resultados
import StepsDisplay from './hooks/StepsDisplay';


// Definimos los tipos para nuestros datos
type Matrix = (number | string)[][];
type Vector = (number | string)[];

function App() {
  // --- ESTADO PARA LA CONFIGURACIÓN ---
  const [origenes, setOrigenes] = useState(3);
  const [destinos, setDestinos] = useState(4);

  // --- ESTADO PARA LOS DATOS DE LA TABLA ---
  const [costos, setCostos] = useState<Matrix>([]);
  const [oferta, setOferta] = useState<Vector>([]);
  const [demanda, setDemanda] = useState<Vector>([]);

  // --- ESTADO PARA LOS RESULTADOS ---
  const [resultado, setResultado] = useState<{ asignaciones: number[][]; costoTotal: number; steps: VogelStep[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // useEffect se ejecuta cuando 'origenes' o 'destinos' cambian.
  // Es perfecto para inicializar o redimensionar nuestras tablas.
  useEffect(() => {
    // Crea una nueva matriz de costos llena de strings vacíos ''
    const nuevosCostos = Array(origenes).fill(0).map(() => Array(destinos).fill(''));
    setCostos(nuevosCostos);

    // Crea nuevos vectores de oferta y demanda
    setOferta(Array(origenes).fill(''));
    setDemanda(Array(destinos).fill(''));
    
    // Limpia resultados anteriores al cambiar dimensiones
    setResultado(null); 
  }, [origenes, destinos]);

  // --- FUNCIONES PARA MANEJAR CAMBIOS DEL USUARIO ---

  // Se activa cuando el usuario cambia el valor de un costo
  const handleCostoChange = (val: string, i: number, j: number) => {
    // Hacemos una copia del estado actual para no modificarlo directamente (¡muy importante en React!)
    const nuevosCostos = [...costos];
    nuevosCostos[i][j] = val;
    setCostos(nuevosCostos);
  };

  // Se activa cuando el usuario cambia un valor de la oferta
  const handleOfertaChange = (val: string, i: number) => {
    const nuevaOferta = [...oferta];
    nuevaOferta[i] = val;
    setOferta(nuevaOferta);
  };
  
  // Se activa cuando el usuario cambia un valor de la demanda
  const handleDemandaChange = (val: string, i: number) => {
    const nuevaDemanda = [...demanda];
    nuevaDemanda[i] = val;
    setDemanda(nuevaDemanda);
  };

  // --- FUNCIÓN PARA EJECUTAR EL CÁLCULO ---
  const handleCalcular = () => {
    setResultado(null);
    setError(null);

    // Convertimos los datos de string a number, validando que no estén vacíos
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

      // Validamos que el modelo esté balanceado
      const totalOferta = ofertaNum.reduce((sum, val) => sum + val, 0);
      const totalDemanda = demandaNum.reduce((sum, val) => sum + val, 0);

      if (totalOferta !== totalDemanda) {
        throw new Error(`Desbalance: La oferta total (${totalOferta}) no es igual a la demanda total (${totalDemanda}).`);
      }

      // Si todo es correcto, llamamos a la lógica de Vogel
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