import { Observable } from 'rxjs';
import { Evolucion, Resumen } from './estadistica.model';

export abstract class EstadisticaPort {
  abstract evolucion(pacienteId: number): Observable<Evolucion>;
  abstract resumen(): Observable<Resumen>;
}