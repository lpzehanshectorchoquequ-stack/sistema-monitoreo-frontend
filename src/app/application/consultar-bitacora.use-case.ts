import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroBitacora, PaginaBitacora, ResumenBitacora } from '../domain/bitacora.model';
import { BitacoraPort } from '../domain/bitacora.port';

@Injectable({ providedIn: 'root' })
export class ConsultarBitacoraUseCase {
  private readonly puerto = inject(BitacoraPort);

  buscar(filtro: FiltroBitacora, pagina: number, tamano: number): Observable<PaginaBitacora> {
    return this.puerto.buscar(filtro, pagina, tamano);
  }

  resumen(): Observable<ResumenBitacora> {
    return this.puerto.resumen();
  }
}