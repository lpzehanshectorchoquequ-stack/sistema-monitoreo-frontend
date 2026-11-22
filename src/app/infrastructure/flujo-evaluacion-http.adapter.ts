import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DetalleEvaluacion, EnvioRespuestas, ResumenEvaluacion } from '../domain/flujo-evaluacion.model';
import { FlujoEvaluacionPort } from '../domain/flujo-evaluacion.port';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class FlujoEvaluacionHttpAdapter implements FlujoEvaluacionPort {
  private readonly http = inject(HttpClient);

  listar(): Observable<ResumenEvaluacion[]> {
    return this.http.get<ResumenEvaluacion[]>(`${API_URL}/evaluaciones`);
  }

  detalle(id: number): Observable<DetalleEvaluacion> {
    return this.http.get<DetalleEvaluacion>(`${API_URL}/evaluaciones/${id}`);
  }

  asignar(pacienteId: number, instrumentoId: number): Observable<DetalleEvaluacion> {
    return this.http.post<DetalleEvaluacion>(`${API_URL}/pacientes/${pacienteId}/evaluaciones/asignar`, {
      instrumentoId,
    });
  }

  responder(id: number, envio: EnvioRespuestas): Observable<DetalleEvaluacion> {
    return this.http.post<DetalleEvaluacion>(`${API_URL}/evaluaciones/${id}/responder`, envio);
  }

  aprobar(id: number, comentario: string): Observable<DetalleEvaluacion> {
    return this.http.post<DetalleEvaluacion>(`${API_URL}/evaluaciones/${id}/aprobar`, { comentario });
  }

  cancelar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/evaluaciones/${id}`);
  }
}