export interface Sesion {
  token: string;
  nombre: string;
  correo: string;
  rol: string;
  debeCambiarContrasena: boolean;
}