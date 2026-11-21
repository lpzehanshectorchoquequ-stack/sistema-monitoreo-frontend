import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Evolucion, Resumen } from '../domain/estadistica.model';
import { EstadisticaPort } from '../domain/estadistica.port';

@Injectable({ providedIn: 'root' })
export class ConsultarEstadisticasUseCase {
  private readonly puerto = inject(EstadisticaPort);

  evolucion(pacienteId: number): Observable<Evolucion> {
    return this.puerto.evolucion(pacienteId);
  }

  resumen(): Observable<Resumen> {
    return this.puerto.resumen();
  }
}