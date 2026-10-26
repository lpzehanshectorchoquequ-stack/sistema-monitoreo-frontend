import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Paciente, calcularEdad } from '../../domain/paciente.model';
import { TemaService } from '../shared/tema.service';

@Component({
  selector: 'app-mis-hijos',
  imports: [RouterLink],
  templateUrl: './mis-hijos.page.html',
})
export class MisHijosPage implements OnInit {
  private readonly casoUso = inject(GestionarPacientesUseCase);
  private readonly tema = inject(TemaService);

  protected readonly hijos = signal<Paciente[]>([]);
  protected readonly seleccionado = signal<Paciente | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly edad = calcularEdad;

  ngOnInit(): void {
    this.casoUso.misHijos().subscribe({
      next: (lista) => {
        this.hijos.set(lista);
        if (lista.length > 0) {
          this.seleccionar(lista[0]);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información');
        this.cargando.set(false);
      },
    });
  }

  protected seleccionar(hijo: Paciente): void {
    this.seleccionado.set(hijo);
    this.tema.aplicar(hijo.genero);
  }

  protected avatar(hijo: Paciente): string {
    return hijo.genero === 'NINA' ? '👧' : hijo.genero === 'NINO' ? '👦' : '🧒';
  }
}