import { Observable } from 'rxjs';
import { EstadisticasCitas } from './estadistica-citas.model';
import { Evolucion, Resumen } from './estadistica.model';

export abstract class EstadisticaPort {
  abstract evolucion(pacienteId: number): Observable<Evolucion>;
  abstract resumen(): Observable<Resumen>;
  abstract citas(periodo: string): Observable<EstadisticasCitas>;
}