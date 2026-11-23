import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HijoDatos, Paciente, PacienteDatos, Psicologo, Tutor, TutorVinculado } from '../domain/paciente.model';
import { PacientePort } from '../domain/paciente.port';

@Injectable({ providedIn: 'root' })
export class GestionarPacientesUseCase {
  private readonly puerto = inject(PacientePort);

  listar(): Observable<Paciente[]> {
    return this.puerto.listar();
  }

  misHijos(): Observable<Paciente[]> {
    return this.puerto.misHijos();
  }

  obtener(id: number): Observable<Paciente> {
    return this.puerto.obtener(id);
  }

  crear(datos: PacienteDatos): Observable<Paciente> {
    return this.puerto.crear(datos);
  }

  actualizar(id: number, datos: PacienteDatos): Observable<Paciente> {
    return this.puerto.actualizar(id, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.puerto.eliminar(id);
  }

  tutores(): Observable<Tutor[]> {
    return this.puerto.tutores();
  }

  registrarHijo(datos: HijoDatos): Observable<Paciente> {
    return this.puerto.registrarHijo(datos);
  }

  psicologos(): Observable<Psicologo[]> {
    return this.puerto.psicologos();
  }

  tutoresDe(pacienteId: number): Observable<TutorVinculado[]> {
    return this.puerto.tutoresDe(pacienteId);
  }

  vincularTutor(pacienteId: number, tutorId: number, parentesco: string): Observable<TutorVinculado[]> {
    return this.puerto.vincularTutor(pacienteId, tutorId, parentesco);
  }

  desvincularTutor(pacienteId: number, tutorId: number): Observable<TutorVinculado[]> {
    return this.puerto.desvincularTutor(pacienteId, tutorId);
  }
}