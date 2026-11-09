import { Observable } from 'rxjs';
import { Usuario, UsuarioCreado, UsuarioDatos } from './usuario.model';

export abstract class UsuarioPort {
  abstract listar(): Observable<Usuario[]>;
  abstract crear(datos: UsuarioDatos): Observable<UsuarioCreado>;
  abstract restablecerContrasena(id: number): Observable<UsuarioCreado>;
  abstract cambiarEstado(id: number, activo: boolean): Observable<Usuario>;
}