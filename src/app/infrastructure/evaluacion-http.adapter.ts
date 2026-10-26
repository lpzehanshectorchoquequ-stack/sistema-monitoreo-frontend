import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluacion, EvaluacionDatos, Instrumento } from '../domain/evaluacion.model';
import { EvaluacionPort } from '../domain/evaluacion.port';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class EvaluacionHttpAdapter implements EvaluacionPort {
  private readonly http = inject(HttpClient);

  listarInstrumentos(): Observable<Instrumento[]> {
    return this.http.get<Instrumento[]>(`${API_URL}/instrumentos`);
  }

  obtenerInstrumento(id: number): Observable<Instrumento> {
    return this.http.get<Instrumento>(`${API_URL}/instrumentos/${id}`);
  }

  aplicar(pacienteId: number, datos: EvaluacionDatos): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(`${API_URL}/pacientes/${pacienteId}/evaluaciones`, datos);
  }

  historial(pacienteId: number): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(`${API_URL}/pacientes/${pacienteId}/evaluaciones`);
  }
}