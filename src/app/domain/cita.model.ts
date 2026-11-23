export type EstadoCita =
  | 'SOLICITADA'
  | 'PROPUESTA'
  | 'CONFIRMADA'
  | 'RECHAZADA'
  | 'CANCELADA'
  | 'ATENDIDA'
  | 'NO_ASISTIO';

export interface Horario {
  id: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  duracionMinutos: number;
}

export interface MisHorarios {
  tarifaConsulta: number;
  horarios: Horario[];
}

export interface HorarioDatos {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  duracionMinutos: number;
}

export interface Espacio {
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

export interface Cita {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  psicologoNombre: string;
  solicitanteNombre: string;
  solicitanteRol: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  urgente: boolean;
  estado: EstadoCita;
  costo: number;
  comentarioPsicologa: string | null;
  acciones: string[];
}

export interface CitaDatos {
  pacienteId: number;
  fecha: string;
  horaInicio: string;
  motivo: string;
  urgente: boolean;
}

export interface AccionCita {
  accion: string;
  comentario: string;
  costo: number | null;
}

export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ETIQUETA_CITA: Record<string, string> = {
  SOLICITADA: 'Esperando confirmación',
  PROPUESTA: 'Propuesta por la psicóloga',
  CONFIRMADA: 'Confirmada',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada',
  ATENDIDA: 'Atendida',
  NO_ASISTIO: 'No asistió',
};