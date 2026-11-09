import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario, UsuarioCreado, UsuarioDatos } from '../domain/usuario.model';
import { UsuarioPort } from '../domain/usuario.port';

@Injectable({ providedIn: 'root' })
export class GestionarUsuariosUseCase {
  private readonly puerto = inject(UsuarioPort);

  listar(): Observable<Usuario[]> {
    return this.puerto.listar();
  }

  crear(datos: UsuarioDatos): Observable<UsuarioCreado> {
    return this.puerto.crear(datos);
  }

  restablecerContrasena(id: number): Observable<UsuarioCreado> {
    return this.puerto.restablecerContrasena(id);
  }

  cambiarEstado(id: number, activo: boolean): Observable<Usuario> {
    return this.puerto.cambiarEstado(id, activo);
  }
}