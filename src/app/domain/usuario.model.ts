export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
  pendienteCambio: boolean;
  psicologoNombre: string | null;
}

export interface UsuarioCreado {
  usuario: Usuario;
  contrasenaTemporal: string;
}

export interface UsuarioDatos {
  nombre: string;
  correo: string;
  rol: string;
}