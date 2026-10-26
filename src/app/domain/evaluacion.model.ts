export interface PreguntaInstrumento {
  id: number;
  orden: number;
  texto: string;
  subescala: string;
}

export interface Instrumento {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  trastorno: string;
  quienResponde: string;
  estadoValidacion: string;
  totalPreguntas: number;
  preguntas: PreguntaInstrumento[];
}

export interface Conclusion {
  trastorno: string;
  nivel: string;
  recomendacion: string;
  explicacion: string[];
}

export interface Evaluacion {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  instrumentoNombre: string;
  estadoValidacion: string;
  fecha: string;
  observaciones: string | null;
  conclusion: Conclusion | null;
}

export interface RespuestaDato {
  preguntaId: number;
  valor: number;
}

export interface EvaluacionDatos {
  instrumentoId: number;
  respuestas: RespuestaDato[];
  observaciones: string;
}

export const OPCIONES_RESPUESTA = [
  { valor: 0, etiqueta: 'Nunca' },
  { valor: 1, etiqueta: 'Algunas veces' },
  { valor: 2, etiqueta: 'Frecuentemente' },
  { valor: 3, etiqueta: 'Casi siempre' },
];