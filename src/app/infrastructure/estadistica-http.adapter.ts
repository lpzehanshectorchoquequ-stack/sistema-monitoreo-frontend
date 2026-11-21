import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Evolucion, Resumen } from '../domain/estadistica.model';
import { EstadisticaPort } from '../domain/estadistica.port';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class EstadisticaHttpAdapter implements EstadisticaPort {
  private readonly http = inject(HttpClient);

  evolucion(pacienteId: number): Observable<Evolucion> {
    return this.http.get<Evolucion>(`${API_URL}/estadisticas/pacientes/${pacienteId}/evolucion`);
  }

  resumen(): Observable<Resumen> {
    return this.http.get<Resumen>(`${API_URL}/estadisticas/resumen`);
  }
}