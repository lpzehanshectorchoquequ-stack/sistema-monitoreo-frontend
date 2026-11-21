import { Observable } from 'rxjs';
import { PreguntaDatos, TestDatos, TestDetalle, TestResumen } from './test.model';

export abstract class TestPort {
  abstract listar(): Observable<TestResumen[]>;
  abstract obtener(id: number): Observable<TestDetalle>;
  abstract crear(datos: TestDatos): Observable<TestDetalle>;
  abstract actualizar(id: number, datos: TestDatos): Observable<TestDetalle>;
  abstract eliminar(id: number): Observable<void>;
  abstract agregarPregunta(id: number, datos: PreguntaDatos): Observable<TestDetalle>;
  abstract editarPregunta(id: number, preguntaId: number, datos: PreguntaDatos): Observable<TestDetalle>;
  abstract quitarPregunta(id: number, preguntaId: number): Observable<TestDetalle>;
  abstract guardarUmbrales(id: number, moderado: number, alto: number): Observable<TestDetalle>;
}