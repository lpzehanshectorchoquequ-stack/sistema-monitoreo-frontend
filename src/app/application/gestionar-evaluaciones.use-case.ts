import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluacion, EvaluacionDatos, Instrumento } from '../domain/evaluacion.model';
import { EvaluacionPort } from '../domain/evaluacion.port';

@Injectable({ providedIn: 'root' })
export class GestionarEvaluacionesUseCase {
  private readonly puerto = inject(EvaluacionPort);

  listarInstrumentos(): Observable<Instrumento[]> {
    return this.puerto.listarInstrumentos();
  }

  obtenerInstrumento(id: number): Observable<Instrumento> {
    return this.puerto.obtenerInstrumento(id);
  }

  aplicar(pacienteId: number, datos: EvaluacionDatos): Observable<Evaluacion> {
    return this.puerto.aplicar(pacienteId, datos);
  }

  historial(pacienteId: number): Observable<Evaluacion[]> {
    return this.puerto.historial(pacienteId);
  }
}