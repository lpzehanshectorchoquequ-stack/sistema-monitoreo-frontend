import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AccionCita, Cita, CitaDatos, Espacio, HorarioDatos, MisHorarios } from '../domain/cita.model';
import { CitaPort } from '../domain/cita.port';

@Injectable({ providedIn: 'root' })
export class GestionarCitasUseCase {
  private readonly puerto = inject(CitaPort);

  misHorarios(): Observable<MisHorarios> {
    return this.puerto.misHorarios();
  }

  agregarHorario(datos: HorarioDatos): Observable<MisHorarios> {
    return this.puerto.agregarHorario(datos);
  }

  quitarHorario(id: number): Observable<MisHorarios> {
    return this.puerto.quitarHorario(id);
  }

  guardarTarifa(tarifa: number): Observable<MisHorarios> {
    return this.puerto.guardarTarifa(tarifa);
  }

  listar(): Observable<Cita[]> {
    return this.puerto.listar();
  }

  espaciosLibres(pacienteId: number): Observable<Espacio[]> {
    return this.puerto.espaciosLibres(pacienteId);
  }

  crear(datos: CitaDatos): Observable<Cita> {
    return this.puerto.crear(datos);
  }

  accion(id: number, datos: AccionCita): Observable<Cita> {
    return this.puerto.accion(id, datos);
  }
}