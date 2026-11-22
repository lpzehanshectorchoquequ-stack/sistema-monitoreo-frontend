import { Conclusion } from './evaluacion.model';

export type EstadoEvaluacion = 'PENDIENTE' | 'POR_REVISAR' | 'APROBADA';

export interface ResumenEvaluacion {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  instrumentoNombre: string;
  trastorno: string;
  estado: EstadoEvaluacion;
  fecha: string;
  nivel: string | null;
}

export interface AreaResultado {
  nombre: string;
  sintomas: number;
  totalPreguntas: number;
  puntaje: number;
  puntajeMaximo: number;
  porcentaje: number;
}

export interface RespuestaDetalle {
  preguntaId: number;
  orden: number;
  texto: string;
  subescala: string;
  valor: number;
}

export interface PreguntaFlujo {
  id: number;
  orden: number;
  texto: string;
  subescala: string;
}

export interface DetalleEvaluacion {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  instrumentoNombre: string;
  trastorno: string;
  descripcion: string | null;
  estado: EstadoEvaluacion;
  fecha: string;
  observaciones: string | null;
  comentarioPsicologa: string | null;
  respondidoPor: string | null;
  aprobadoPor: string | null;
  cambiosRespuestas: number;
  puedeResponder: boolean;
  puedeAprobar: boolean;
  puedeVerResultado: boolean;
  preguntas: PreguntaFlujo[];
  respuestas: RespuestaDetalle[];
  conclusion: Conclusion | null;
  areas: AreaResultado[];
}

export interface RespuestaEnvio {
  preguntaId: number;
  valor: number;
}

export interface EnvioRespuestas {
  respuestas: RespuestaEnvio[];
  cambios: number;
  observaciones: string;
}

export const ETIQUETA_ESTADO: Record<string, string> = {
  PENDIENTE: 'Esperando respuestas',
  POR_REVISAR: 'Por revisar',
  APROBADA: 'Aprobada',
};