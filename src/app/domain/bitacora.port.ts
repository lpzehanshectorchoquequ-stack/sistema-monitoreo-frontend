import { Observable } from 'rxjs';
import { FiltroBitacora, PaginaBitacora, ResumenBitacora } from './bitacora.model';

export abstract class BitacoraPort {
  abstract buscar(filtro: FiltroBitacora, pagina: number, tamano: number): Observable<PaginaBitacora>;
  abstract resumen(): Observable<ResumenBitacora>;
}