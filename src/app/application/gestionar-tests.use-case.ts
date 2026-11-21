import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PreguntaDatos, TestDatos, TestDetalle, TestResumen } from '../domain/test.model';
import { TestPort } from '../domain/test.port';

@Injectable({ providedIn: 'root' })
export class GestionarTestsUseCase {
  private readonly puerto = inject(TestPort);

  listar(): Observable<TestResumen[]> {
    return this.puerto.listar();
  }

  obtener(id: number): Observable<TestDetalle> {
    return this.puerto.obtener(id);
  }

  crear(datos: TestDatos): Observable<TestDetalle> {
    return this.puerto.crear(datos);
  }

  actualizar(id: number, datos: TestDatos): Observable<TestDetalle> {
    return this.puerto.actualizar(id, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.puerto.eliminar(id);
  }

  agregarPregunta(id: number, datos: PreguntaDatos): Observable<TestDetalle> {
    return this.puerto.agregarPregunta(id, datos);
  }

  editarPregunta(id: number, preguntaId: number, datos: PreguntaDatos): Observable<TestDetalle> {
    return this.puerto.editarPregunta(id, preguntaId, datos);
  }

  quitarPregunta(id: number, preguntaId: number): Observable<TestDetalle> {
    return this.puerto.quitarPregunta(id, preguntaId);
  }

  guardarUmbrales(id: number, moderado: number, alto: number): Observable<TestDetalle> {
    return this.puerto.guardarUmbrales(id, moderado, alto);
  }
}