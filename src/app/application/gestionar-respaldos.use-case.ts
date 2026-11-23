import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Respaldo } from '../domain/respaldo.model';
import { RespaldoPort } from '../domain/respaldo.port';

@Injectable({ providedIn: 'root' })
export class GestionarRespaldosUseCase {
  private readonly puerto = inject(RespaldoPort);

  listar(): Observable<Respaldo[]> {
    return this.puerto.listar();
  }

  crear(): Observable<Respaldo> {
    return this.puerto.crear();
  }

  descargar(nombre: string): Observable<Blob> {
    return this.puerto.descargar(nombre);
  }

  eliminar(nombre: string): Observable<void> {
    return this.puerto.eliminar(nombre);
  }
}