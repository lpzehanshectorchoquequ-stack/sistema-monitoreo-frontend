import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { SessionStore } from '../../application/session.store';
import { FondoComponent } from './fondo.component';
import { TemaService } from './tema.service';

interface ItemMenu {
  etiqueta: string;
  icono: string;
  ruta?: string;
  exacto?: boolean;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FondoComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  private readonly store = inject(SessionStore);
  private readonly router = inject(Router);
  private readonly tema = inject(TemaService);
  private readonly pacientes = inject(GestionarPacientesUseCase);

  protected readonly sesion = this.store.sesion;
  protected readonly inicial = computed(() => (this.sesion()?.nombre ?? '?').charAt(0).toUpperCase());
  protected readonly fecha = new Date().toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  protected readonly menu = computed<ItemMenu[]>(() => {
    const inicio: ItemMenu = { etiqueta: 'Inicio', icono: '🏠', ruta: '/', exacto: true };
    switch (this.sesion()?.rol) {
      case 'Admin':
        return [inicio, { etiqueta: 'Pacientes', icono: '🧒', ruta: '/pacientes' }];
      case 'Psicologo':
        return [
          inicio,
          { etiqueta: 'Pacientes', icono: '🧒', ruta: '/pacientes' },
          { etiqueta: 'Evaluaciones', icono: '🧠', ruta: '/evaluaciones' },
          { etiqueta: 'Citas', icono: '📅' },
          { etiqueta: 'Horarios', icono: '🕒' },
        ];
      case 'Tutor':
        return [
          inicio,
          { etiqueta: 'Mi hijo/a', icono: '🧒', ruta: '/mis-hijos' },
          { etiqueta: 'Citas', icono: '📅' },
        ];
      default:
        return [inicio];
    }
  });

  ngOnInit(): void {
    if (this.sesion()?.rol === 'Tutor') {
      this.pacientes.misHijos().subscribe((lista) => {
        if (lista.length > 0) {
          this.tema.aplicar(lista[0].genero);
        }
      });
    } else {
      this.tema.aplicar(null);
    }
  }

  protected cerrarSesion(): void {
    this.store.cerrar();
    this.tema.aplicar(null);
    this.router.navigateByUrl('/login');
  }
}