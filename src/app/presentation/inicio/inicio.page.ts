import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStore } from '../../application/session.store';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.scss',
})
export class InicioPage {
  private readonly store = inject(SessionStore);
  private readonly router = inject(Router);

  protected readonly sesion = this.store.sesion;

  protected cerrarSesion(): void {
    this.store.cerrar();
    this.router.navigateByUrl('/login');
  }
}