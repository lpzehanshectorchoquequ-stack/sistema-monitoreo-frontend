import { Conteo } from './estadistica.model';

export interface SemanaCitas {
  desde: string;
  atendidas: number;
  canceladas: number;
  noAsistio: number;
  confirmadas: number;
  ingresos: number;
}

export interface PsicologaCitas {
  nombre: string;
  totalCitas: number;
  atendidas: number;
  ingresos: number;
  asistencia: number | null;
}

export interface EstadisticasCitas {
  periodo: string;
  desde: string;
  hasta: string;
  totalCitas: number;
  atendidas: number;
  canceladas: number;
  noAsistio: number;
  confirmadas: number;
  pendientes: number;
  pendientesRespuesta: number;
  urgentesPendientes: number;
  ingresosPeriodo: number;
  ingresosSemana: number;
  asistencia: number | null;
  semanas: SemanaCitas[];
  porEstado: Conteo[];
  porDia: Conteo[];
  porPsicologa: PsicologaCitas[];
}