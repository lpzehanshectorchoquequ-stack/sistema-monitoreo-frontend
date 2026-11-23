import { Observable } from 'rxjs';
import { HijoDatos, Paciente, PacienteDatos, Psicologo, Tutor, TutorVinculado } from './paciente.model';

export abstract class PacientePort {
  abstract listar(): Observable<Paciente[]>;
  abstract misHijos(): Observable<Paciente[]>;
  abstract obtener(id: number): Observable<Paciente>;
  abstract crear(datos: PacienteDatos): Observable<Paciente>;
  abstract actualizar(id: number, datos: PacienteDatos): Observable<Paciente>;
  abstract eliminar(id: number): Observable<void>;
  abstract tutores(): Observable<Tutor[]>;
  abstract registrarHijo(datos: HijoDatos): Observable<Paciente>;
  abstract psicologos(): Observable<Psicologo[]>;
  abstract tutoresDe(pacienteId: number): Observable<TutorVinculado[]>;
  abstract vincularTutor(pacienteId: number, tutorId: number, parentesco: string): Observable<TutorVinculado[]>;
  abstract desvincularTutor(pacienteId: number, tutorId: number): Observable<TutorVinculado[]>;
}