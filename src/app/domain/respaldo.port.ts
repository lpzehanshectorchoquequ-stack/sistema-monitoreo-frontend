import { Observable } from 'rxjs';
import { Respaldo } from './respaldo.model';

export abstract class RespaldoPort {
  abstract listar(): Observable<Respaldo[]>;
  abstract crear(): Observable<Respaldo>;
  abstract descargar(nombre: string): Observable<Blob>;
  abstract eliminar(nombre: string): Observable<void>;
}