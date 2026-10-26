import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente, PacienteDatos, Tutor } from '../domain/paciente.model';
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
}