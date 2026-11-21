import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PreguntaDatos, TestDatos, TestDetalle, TestResumen } from '../domain/test.model';
import { TestPort } from '../domain/test.port';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class TestHttpAdapter implements TestPort {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/tests`;

  listar(): Observable<TestResumen[]> {
    return this.http.get<TestResumen[]>(this.url);
  }

  obtener(id: number): Observable<TestDetalle> {
    return this.http.get<TestDetalle>(`${this.url}/${id}`);
  }

  crear(datos: TestDatos): Observable<TestDetalle> {
    return this.http.post<TestDetalle>(this.url, datos);
  }

  actualizar(id: number, datos: TestDatos): Observable<TestDetalle> {
    return this.http.put<TestDetalle>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  agregarPregunta(id: number, datos: PreguntaDatos): Observable<TestDetalle> {
    return this.http.post<TestDetalle>(`${this.url}/${id}/preguntas`, datos);
  }

  editarPregunta(id: number, preguntaId: number, datos: PreguntaDatos): Observable<TestDetalle> {
    return this.http.put<TestDetalle>(`${this.url}/${id}/preguntas/${preguntaId}`, datos);
  }

  quitarPregunta(id: number, preguntaId: number): Observable<TestDetalle> {
    return this.http.delete<TestDetalle>(`${this.url}/${id}/preguntas/${preguntaId}`);
  }

  guardarUmbrales(id: number, moderado: number, alto: number): Observable<TestDetalle> {
    return this.http.put<TestDetalle>(`${this.url}/${id}/umbrales`, { moderado, alto });
  }
}
