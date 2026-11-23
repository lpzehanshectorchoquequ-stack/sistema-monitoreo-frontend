import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FiltroBitacora, PaginaBitacora, ResumenBitacora } from '../domain/bitacora.model';
import { BitacoraPort } from '../domain/bitacora.port';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class BitacoraHttpAdapter implements BitacoraPort {
  private readonly http = inject(HttpClient);

  buscar(filtro: FiltroBitacora, pagina: number, tamano: number): Observable<PaginaBitacora> {
    let params = new HttpParams().set('pagina', pagina).set('tamano', tamano);
    if (filtro.texto) {
      params = params.set('texto', filtro.texto);
    }
    if (filtro.modulo) {
      params = params.set('modulo', filtro.modulo);
    }
    if (filtro.resultado) {
      params = params.set('resultado', filtro.resultado);
    }
    if (filtro.desde) {
      params = params.set('desde', filtro.desde);
    }
    if (filtro.hasta) {
      params = params.set('hasta', filtro.hasta);
    }
    return this.http.get<PaginaBitacora>(`${API_URL}/bitacora`, { params });
  }

  resumen(): Observable<ResumenBitacora> {
    return this.http.get<ResumenBitacora>(`${API_URL}/bitacora/resumen`);
  }
}