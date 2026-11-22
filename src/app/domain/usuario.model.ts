export interface Usuario {
  id: number;
  nombre: string; // nombre completo, para mostrar
  nombrePila: string;
  apellido: string;
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
  apellido: string;
  correo: string;
  rol: string;
}