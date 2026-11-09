import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario, UsuarioCreado, UsuarioDatos } from '../domain/usuario.model';
import { UsuarioPort } from '../domain/usuario.port';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class UsuarioHttpAdapter implements UsuarioPort {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/usuarios`;

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  crear(datos: UsuarioDatos): Observable<UsuarioCreado> {
    return this.http.post<UsuarioCreado>(this.url, datos);
  }

  restablecerContrasena(id: number): Observable<UsuarioCreado> {
    return this.http.post<UsuarioCreado>(`${this.url}/${id}/restablecer-contrasena`, {});
  }

  cambiarEstado(id: number, activo: boolean): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}/estado`, { activo });
  }
}