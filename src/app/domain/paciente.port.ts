import { Observable } from 'rxjs';
import { Paciente, PacienteDatos, Tutor } from './paciente.model';

export abstract class PacientePort {
  abstract listar(): Observable<Paciente[]>;
  abstract misHijos(): Observable<Paciente[]>;
  abstract obtener(id: number): Observable<Paciente>;
  abstract crear(datos: PacienteDatos): Observable<Paciente>;
  abstract actualizar(id: number, datos: PacienteDatos): Observable<Paciente>;
  abstract eliminar(id: number): Observable<void>;
  abstract tutores(): Observable<Tutor[]>;
}