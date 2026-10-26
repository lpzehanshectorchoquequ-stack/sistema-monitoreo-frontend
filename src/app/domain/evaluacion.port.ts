import { Observable } from 'rxjs';
import { Evaluacion, EvaluacionDatos, Instrumento } from './evaluacion.model';

export abstract class EvaluacionPort {
  abstract listarInstrumentos(): Observable<Instrumento[]>;
  abstract obtenerInstrumento(id: number): Observable<Instrumento>;
  abstract aplicar(pacienteId: number, datos: EvaluacionDatos): Observable<Evaluacion>;
  abstract historial(pacienteId: number): Observable<Evaluacion[]>;
}