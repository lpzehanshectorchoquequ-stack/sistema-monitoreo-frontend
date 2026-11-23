import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HijoDatos, Paciente, PacienteDatos, Psicologo, Tutor, TutorVinculado } from '../domain/paciente.model';
import { PacientePort } from '../domain/paciente.port';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class PacienteHttpAdapter implements PacientePort {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/pacientes`;

  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.url);
  }

  misHijos(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.url}/mis-hijos`);
  }

  obtener(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }

  crear(datos: PacienteDatos): Observable<Paciente> {
    return this.http.post<Paciente>(this.url, datos);
  }

  actualizar(id: number, datos: PacienteDatos): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  tutores(): Observable<Tutor[]> {
    return this.http.get<Tutor[]>(`${this.url}/tutores`);
  }

  registrarHijo(datos: HijoDatos): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.url}/mis-hijos`, datos);
  }

  psicologos(): Observable<Psicologo[]> {
    return this.http.get<Psicologo[]>(`${this.url}/psicologos`);
  }

  tutoresDe(pacienteId: number): Observable<TutorVinculado[]> {
    return this.http.get<TutorVinculado[]>(`${this.url}/${pacienteId}/tutores`);
  }

  vincularTutor(pacienteId: number, tutorId: number, parentesco: string): Observable<TutorVinculado[]> {
    return this.http.post<TutorVinculado[]>(`${this.url}/${pacienteId}/tutores`, { tutorId, parentesco });
  }

  desvincularTutor(pacienteId: number, tutorId: number): Observable<TutorVinculado[]> {
    return this.http.delete<TutorVinculado[]>(`${this.url}/${pacienteId}/tutores/${tutorId}`);
  }
}