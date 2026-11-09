import { Observable } from 'rxjs';
import { Sesion } from './sesion.model';

export abstract class AuthPort {
  abstract login(correo: string, contrasena: string): Observable<Sesion>;
  abstract cambiarContrasena(contrasenaActual: string, contrasenaNueva: string): Observable<Sesion>;
}