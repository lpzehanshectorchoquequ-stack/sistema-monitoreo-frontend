import { Injectable, computed, signal } from '@angular/core';
import { Sesion } from '../domain/sesion.model';

const CLAVE = 'sesion';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly _sesion = signal<Sesion | null>(this.leer());

  readonly sesion = this._sesion.asReadonly();
  readonly autenticado = computed(() => this._sesion() !== null);

  get token(): string | null {
    return this._sesion()?.token ?? null;
  }

  guardar(sesion: Sesion): void {
    localStorage.setItem(CLAVE, JSON.stringify(sesion));
    this._sesion.set(sesion);
  }

  cerrar(): void {
    localStorage.removeItem(CLAVE);
    this._sesion.set(null);
  }

  private leer(): Sesion | null {
    try {
      const texto = localStorage.getItem(CLAVE);
      return texto ? (JSON.parse(texto) as Sesion) : null;
    } catch {
      return null;
    }
  }
}