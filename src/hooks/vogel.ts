

type MatrixNum = number[][];
type VectorNum = number[];


export interface VogelStep {
  descripcion: string;
  penalizacionesFila: (number | null)[];
  penalizacionesColumna: (number | null)[];
  asignaciones: MatrixNum;
  oferta: VectorNum;
  demanda: VectorNum;
  iteracion: number;
}

export const resolverVogel = (
  costosIniciales: MatrixNum,
  ofertaInicial: VectorNum,
  demandaInicial: VectorNum
) => {
  let costos = costosIniciales.map(fila => [...fila]);
  let oferta = [...ofertaInicial];
  let demanda = [...demandaInicial];
  
  const numOrigenes = oferta.length;
  const numDestinos = demanda.length;
  
  const asignaciones: MatrixNum = Array(numOrigenes).fill(0).map(() => Array(numDestinos).fill(0));
  let costoTotal = 0;

 
  const steps: VogelStep[] = [];
  let iteracionCounter = 1;

  while (oferta.some(o => o > 0) || demanda.some(d => d > 0)) {
    const penalizacionesFila: (number | null)[] = [];
    const penalizacionesColumna: (number | null)[] = [];

    
    for (let i = 0; i < numOrigenes; i++) {
        if (oferta[i] > 0) {
            const costosFilaActivos = costos[i].filter((_, j) => demanda[j] > 0);
            const costosOrdenados = [...costosFilaActivos].sort((a, b) => a - b);
            if (costosOrdenados.length > 1) penalizacionesFila.push(costosOrdenados[1] - costosOrdenados[0]);
            else if (costosOrdenados.length === 1) penalizacionesFila.push(costosOrdenados[0]);
            else penalizacionesFila.push(null);
        } else {
            penalizacionesFila.push(null);
        }
    }
    for (let j = 0; j < numDestinos; j++) {
        if (demanda[j] > 0) {
            const costosColumnaActivos = costos.map(fila => fila[j]).filter((_, i) => oferta[i] > 0);
            const costosOrdenados = [...costosColumnaActivos].sort((a, b) => a - b);
            if (costosOrdenados.length > 1) penalizacionesColumna.push(costosOrdenados[1] - costosOrdenados[0]);
            else if (costosOrdenados.length === 1) penalizacionesColumna.push(costosOrdenados[0]);
            else penalizacionesColumna.push(null);
        } else {
            penalizacionesColumna.push(null);
        }
    }

    const maxPenalizacionFila = Math.max(...penalizacionesFila.filter(p => p !== null) as number[]);
    const maxPenalizacionColumna = Math.max(...penalizacionesColumna.filter(p => p !== null) as number[]);

    let filaSeleccionada = -1, colSeleccionada = -1;
    let descripcionPaso = '';

    if (maxPenalizacionFila >= maxPenalizacionColumna) {
      filaSeleccionada = penalizacionesFila.indexOf(maxPenalizacionFila);
      descripcionPaso = `Mayor penalización (${maxPenalizacionFila}) encontrada en la Fila ${filaSeleccionada + 1}.`;
      let minCosto = Infinity;
      for (let j = 0; j < numDestinos; j++) {
        if (demanda[j] > 0 && costos[filaSeleccionada][j] < minCosto) {
          minCosto = costos[filaSeleccionada][j];
          colSeleccionada = j;
        }
      }
      descripcionPaso += ` El menor costo en esta fila es ${minCosto} en la celda (${filaSeleccionada + 1}, ${colSeleccionada + 1}).`;
    } else {
      colSeleccionada = penalizacionesColumna.indexOf(maxPenalizacionColumna);
      descripcionPaso = `Mayor penalización (${maxPenalizacionColumna}) encontrada en la Columna ${colSeleccionada + 1}.`;
      let minCosto = Infinity;
      for (let i = 0; i < numOrigenes; i++) {
        if (oferta[i] > 0 && costos[i][colSeleccionada] < minCosto) {
          minCosto = costos[i][colSeleccionada];
          filaSeleccionada = i;
        }
      }
      descripcionPaso += ` El menor costo en esta columna es ${minCosto} en la celda (${filaSeleccionada + 1}, ${colSeleccionada + 1}).`;
    }
    
    const cantidadAsignada = Math.min(oferta[filaSeleccionada], demanda[colSeleccionada]);
    descripcionPaso += ` Se asignan ${cantidadAsignada} unidades.`;
    
    
    steps.push({
        descripcion: descripcionPaso,
        penalizacionesFila: [...penalizacionesFila],
        penalizacionesColumna: [...penalizacionesColumna],
        asignaciones: asignaciones.map(f => [...f]), 
        oferta: [...oferta],
        demanda: [...demanda],
        iteracion: iteracionCounter,
    });
    iteracionCounter++;

    
    asignaciones[filaSeleccionada][colSeleccionada] += cantidadAsignada;
    costoTotal += cantidadAsignada * costos[filaSeleccionada][colSeleccionada];
    oferta[filaSeleccionada] -= cantidadAsignada;
    demanda[colSeleccionada] -= cantidadAsignada;
  }

  
  return { asignaciones, costoTotal, steps };
};