import { Observable } from 'rxjs';
import { DetalleEvaluacion, EnvioRespuestas, ResumenEvaluacion } from './flujo-evaluacion.model';

export abstract class FlujoEvaluacionPort {
  abstract listar(): Observable<ResumenEvaluacion[]>;
  abstract detalle(id: number): Observable<DetalleEvaluacion>;
  abstract asignar(pacienteId: number, instrumentoId: number): Observable<DetalleEvaluacion>;
  abstract responder(id: number, envio: EnvioRespuestas): Observable<DetalleEvaluacion>;
  abstract aprobar(id: number, comentario: string): Observable<DetalleEvaluacion>;
  abstract cancelar(id: number): Observable<void>;
}