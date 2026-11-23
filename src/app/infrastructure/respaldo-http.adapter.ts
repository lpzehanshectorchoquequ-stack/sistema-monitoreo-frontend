import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Respaldo } from '../domain/respaldo.model';
import { RespaldoPort } from '../domain/respaldo.port';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class RespaldoHttpAdapter implements RespaldoPort {
  private readonly http = inject(HttpClient);

  listar(): Observable<Respaldo[]> {
    return this.http.get<Respaldo[]>(`${API_URL}/respaldos`);
  }

  crear(): Observable<Respaldo> {
    return this.http.post<Respaldo>(`${API_URL}/respaldos`, {});
  }

  descargar(nombre: string): Observable<Blob> {
    return this.http.get(`${API_URL}/respaldos/${encodeURIComponent(nombre)}/descargar`, { responseType: 'blob' });
  }

  eliminar(nombre: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/respaldos/${encodeURIComponent(nombre)}`);
  }
}