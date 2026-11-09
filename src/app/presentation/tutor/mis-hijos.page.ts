import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Paciente, calcularEdad } from '../../domain/paciente.model';
import { TemaService } from '../shared/tema.service';

@Component({
  selector: 'app-mis-hijos',
  imports: [RouterLink],
  templateUrl: './mis-hijos.page.html',
  styleUrl: './mis-hijos.page.scss',
})
export class MisHijosPage implements OnInit {
  private readonly casoUso = inject(GestionarPacientesUseCase);
  private readonly tema = inject(TemaService);

  protected readonly hijo = signal<Paciente | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly edad = calcularEdad;

  ngOnInit(): void {
    this.casoUso.misHijos().subscribe({
      next: (lista) => {
        const primero = lista[0] ?? null;
        this.hijo.set(primero);
        if (primero) {
          this.tema.aplicar(primero.genero);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información');
        this.cargando.set(false);
      },
    });
  }

  protected avatar(hijo: Paciente): string {
    return hijo.genero === 'NINA' ? '👧' : hijo.genero === 'NINO' ? '👦' : '🧒';
  }
}