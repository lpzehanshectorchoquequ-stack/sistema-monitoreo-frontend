import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DetalleEvaluacion, EnvioRespuestas, ResumenEvaluacion } from '../domain/flujo-evaluacion.model';
import { FlujoEvaluacionPort } from '../domain/flujo-evaluacion.port';

@Injectable({ providedIn: 'root' })
export class GestionarFlujoEvaluacionUseCase {
  private readonly puerto = inject(FlujoEvaluacionPort);

  listar(): Observable<ResumenEvaluacion[]> {
    return this.puerto.listar();
  }

  detalle(id: number): Observable<DetalleEvaluacion> {
    return this.puerto.detalle(id);
  }

  asignar(pacienteId: number, instrumentoId: number): Observable<DetalleEvaluacion> {
    return this.puerto.asignar(pacienteId, instrumentoId);
  }

  responder(id: number, envio: EnvioRespuestas): Observable<DetalleEvaluacion> {
    return this.puerto.responder(id, envio);
  }

  aprobar(id: number, comentario: string): Observable<DetalleEvaluacion> {
    return this.puerto.aprobar(id, comentario);
  }

  cancelar(id: number): Observable<void> {
    return this.puerto.cancelar(id);
  }
}