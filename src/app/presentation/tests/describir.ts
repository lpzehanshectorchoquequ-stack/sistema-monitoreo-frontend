import { CondicionTest } from '../../domain/test.model';

const OPERADORES: Record<string, string> = {
  '>=': 'al menos',
  '>': 'más de',
  '<=': 'como máximo',
  '<': 'menos de',
  '==': 'exactamente',
};

export function etiquetaGrupo(codigo: string): string {
  const texto = codigo.replace(/_/g, ' ').toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function nombreHecho(hecho: string): string {
  if (hecho === 'TOTAL.SINTOMAS') return 'síntomas en total';
  if (hecho === 'TOTAL.PUNTAJE') return 'puntaje total';
  if (hecho.endsWith('.SINTOMAS')) return `síntomas de ${etiquetaGrupo(hecho.replace('.SINTOMAS', '')).toLowerCase()}`;
  if (hecho.endsWith('.PUNTAJE')) return `puntaje de ${etiquetaGrupo(hecho.replace('.PUNTAJE', '')).toLowerCase()}`;
  if (hecho.startsWith('IND_')) return `indicador de ${etiquetaGrupo(hecho.slice(4)).toLowerCase()}`;
  return hecho;
}

export function textoCondicion(condicion: CondicionTest): string {
  return `${nombreHecho(condicion.hecho)}: ${OPERADORES[condicion.operador] ?? condicion.operador} ${condicion.valor}`;
}