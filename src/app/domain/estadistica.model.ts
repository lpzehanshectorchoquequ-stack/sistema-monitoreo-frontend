export interface PuntoEvolucion {
  evaluacionId: number;
  fecha: string;
  instrumento: string;
  trastorno: string;
  nivel: string;
  puntaje: number;
  puntajeMaximo: number;
  porcentaje: number;
  sintomas: number;
  totalPreguntas: number;
}

export interface Evolucion {
  pacienteId: number;
  pacienteNombre: string;
  puntos: PuntoEvolucion[];
}

export interface Conteo {
  etiqueta: string;
  valor: number;
}

export interface Resumen {
  totalPacientes: number;
  totalTutores: number;
  totalEvaluaciones: number;
  porNivel: Conteo[];
  porTrastorno: Conteo[];
  porMes: Conteo[];
  porEdad: Conteo[];
  porGenero: Conteo[];
  porPsicologa: Conteo[];
}

export const ETIQUETA_NIVEL: Record<string, string> = {
  ALTO: 'Indicadores altos',
  MODERADO: 'Indicadores moderados',
  SIN_INDICADORES: 'Sin indicadores',
};