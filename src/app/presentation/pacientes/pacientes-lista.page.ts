import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Paciente, calcularEdad } from '../../domain/paciente.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { BuscadorComponent } from '../shared/buscador.component';
import { normalizar } from '../shared/texto';

@Component({
  selector: 'app-pacientes-lista',
  imports: [RouterLink, BotonAtrasComponent, BuscadorComponent],
  templateUrl: './pacientes-lista.page.html',
})
export class PacientesListaPage implements OnInit {
  private readonly casoUso = inject(GestionarPacientesUseCase);

  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly filtro = signal('');
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly edad = calcularEdad;

  protected readonly visibles = computed(() => {
    const consulta = normalizar(this.filtro());
    if (!consulta) {
      return this.pacientes();
    }
    return this.pacientes().filter(
      (p) =>
        normalizar(p.nombre).includes(consulta) || normalizar(p.tutorNombre ?? '').includes(consulta),
    );
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.casoUso.listar().subscribe({
      next: (lista) => {
        this.pacientes.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de pacientes');
        this.cargando.set(false);
      },
    });
  }

  protected eliminar(paciente: Paciente): void {
    if (!confirm(`¿Eliminar al paciente ${paciente.nombre}?`)) {
      return;
    }
    this.casoUso.eliminar(paciente.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar al paciente'),
    });
  }
}