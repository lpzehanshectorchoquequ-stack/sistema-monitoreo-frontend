import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthPort } from '../domain/auth.port';
import { Sesion } from '../domain/sesion.model';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class CambiarContrasenaUseCase {
  private readonly authPort = inject(AuthPort);
  private readonly store = inject(SessionStore);

  ejecutar(contrasenaActual: string, contrasenaNueva: string): Observable<Sesion> {
    return this.authPort
      .cambiarContrasena(contrasenaActual, contrasenaNueva)
      .pipe(tap((sesion) => this.store.guardar(sesion)));
  }
}