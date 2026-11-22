import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Paciente, calcularEdad } from '../../domain/paciente.model';
import { EvolucionNinoComponent } from '../estadisticas/evolucion-nino.component';
import { TemaService } from '../shared/tema.service';

@Component({
  selector: 'app-mis-hijos',
  imports: [RouterLink, EvolucionNinoComponent],
  templateUrl: './mis-hijos.page.html',
  styleUrl: './mis-hijos.page.scss',
})
export class MisHijosPage implements OnInit {
  private readonly casoUso = inject(GestionarPacientesUseCase);
  private readonly tema = inject(TemaService);

  protected readonly hijos = signal<Paciente[]>([]);
  protected readonly seleccionadoId = signal<number | null>(null);
  protected readonly seleccionado = computed(
    () => this.hijos().find((h) => h.id === this.seleccionadoId()) ?? null,
  );
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
    this.seleccionadoId.set(hijo.id);
    this.tema.aplicar(hijo.genero);
  }

  protected avatar(hijo: Paciente): string {
    return hijo.genero === 'NINA' ? '👧' : hijo.genero === 'NINO' ? '👦' : '🧒';
  }
}