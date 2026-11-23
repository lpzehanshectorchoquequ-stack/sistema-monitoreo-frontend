import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AccionCita, Cita, CitaDatos, Espacio, HorarioDatos, MisHorarios } from '../domain/cita.model';
import { CitaPort } from '../domain/cita.port';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class CitaHttpAdapter implements CitaPort {
  private readonly http = inject(HttpClient);

  misHorarios(): Observable<MisHorarios> {
    return this.http.get<MisHorarios>(`${API_URL}/horarios`);
  }

  agregarHorario(datos: HorarioDatos): Observable<MisHorarios> {
    return this.http.post<MisHorarios>(`${API_URL}/horarios`, datos);
  }

  quitarHorario(id: number): Observable<MisHorarios> {
    return this.http.delete<MisHorarios>(`${API_URL}/horarios/${id}`);
  }

  guardarTarifa(tarifa: number): Observable<MisHorarios> {
    return this.http.put<MisHorarios>(`${API_URL}/horarios/tarifa`, { tarifa });
  }

  listar(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${API_URL}/citas`);
  }

  espaciosLibres(pacienteId: number): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(`${API_URL}/citas/espacios-libres?pacienteId=${pacienteId}`);
  }

  crear(datos: CitaDatos): Observable<Cita> {
    return this.http.post<Cita>(`${API_URL}/citas`, datos);
  }

  accion(id: number, datos: AccionCita): Observable<Cita> {
    return this.http.post<Cita>(`${API_URL}/citas/${id}/accion`, datos);
  }
}