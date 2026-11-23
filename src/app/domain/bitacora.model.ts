export interface RegistroBitacora {
  id: number;
  fechaHora: string;
  usuario: string;
  rol: string | null;
  modulo: string;
  accion: string;
  descripcion: string;
  metodo: string | null;
  ruta: string | null;
  estadoHttp: number | null;
  resultado: 'EXITO' | 'ERROR';
  ip: string | null;
}

export interface PaginaBitacora {
  items: RegistroBitacora[];
  pagina: number;
  tamano: number;
  total: number;
  totalPaginas: number;
}

export interface ResumenBitacora {
  registrosHoy: number;
  erroresUltimas24h: number;
  sesionesFallidasUltimas24h: number;
  usuariosActivosHoy: number;
}

export interface FiltroBitacora {
  texto: string;
  modulo: string;
  resultado: string;
  desde: string;
  hasta: string;
}

export const MODULOS_BITACORA = ['Sesión', 'Cuentas', 'Pacientes', 'Evaluaciones', 'Tests', 'Citas', 'Sistema'];