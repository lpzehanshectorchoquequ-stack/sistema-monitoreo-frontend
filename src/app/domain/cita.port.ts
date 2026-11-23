import { Observable } from 'rxjs';
import { AccionCita, Cita, CitaDatos, Espacio, HorarioDatos, MisHorarios } from './cita.model';

export abstract class CitaPort {
  abstract misHorarios(): Observable<MisHorarios>;
  abstract agregarHorario(datos: HorarioDatos): Observable<MisHorarios>;
  abstract quitarHorario(id: number): Observable<MisHorarios>;
  abstract guardarTarifa(tarifa: number): Observable<MisHorarios>;
  abstract listar(): Observable<Cita[]>;
  abstract espaciosLibres(pacienteId: number): Observable<Espacio[]>;
  abstract crear(datos: CitaDatos): Observable<Cita>;
  abstract accion(id: number, datos: AccionCita): Observable<Cita>;
}