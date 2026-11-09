import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthPort } from '../domain/auth.port';
import { Sesion } from '../domain/sesion.model';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class AuthHttpAdapter implements AuthPort {
  private readonly http = inject(HttpClient);

  login(correo: string, contrasena: string): Observable<Sesion> {
    return this.http.post<Sesion>(`${API_URL}/auth/login`, { correo, contrasena });
  }

  cambiarContrasena(contrasenaActual: string, contrasenaNueva: string): Observable<Sesion> {
    return this.http.post<Sesion>(`${API_URL}/auth/cambiar-contrasena`, {
      contrasenaActual,
      contrasenaNueva,
    });
  }
}