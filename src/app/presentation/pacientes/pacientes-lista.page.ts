import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Paciente, calcularEdad } from '../../domain/paciente.model';

@Component({
  selector: 'app-pacientes-lista',
  imports: [RouterLink],
  templateUrl: './pacientes-lista.page.html',
})
export class PacientesListaPage implements OnInit {
  private readonly casoUso = inject(GestionarPacientesUseCase);

  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly edad = calcularEdad;

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