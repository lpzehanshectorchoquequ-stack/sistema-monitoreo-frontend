import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { GestionarUsuariosUseCase } from '../../application/gestionar-usuarios.use-case';
import { PARENTESCOS, TutorVinculado } from '../../domain/paciente.model';
import { Usuario } from '../../domain/usuario.model';

@Component({
  selector: 'app-tutores-paciente',
  imports: [RouterLink],
  templateUrl: './tutores-paciente.component.html',
  styleUrl: './tutores-paciente.component.scss',
})
export class TutoresPacienteComponent implements OnInit {
  readonly pacienteId = input.required<number>();

  private readonly pacientes = inject(GestionarPacientesUseCase);
  private readonly usuarios = inject(GestionarUsuariosUseCase);

  protected readonly parentescos = PARENTESCOS;
  protected readonly vinculados = signal<TutorVinculado[]>([]);
  protected readonly cuentas = signal<Usuario[]>([]);
  protected readonly tutorElegido = signal(0);
  protected readonly parentescoElegido = signal('');
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);

  protected readonly disponibles = computed(() =>
    this.cuentas().filter((c) => !this.vinculados().some((v) => v.tutorId === c.id)),
  );
  protected readonly puedeAgregar = computed(() => this.tutorElegido() > 0 && this.parentescoElegido() !== '');

  ngOnInit(): void {
    this.pacientes.tutoresDe(this.pacienteId()).subscribe({
      next: (lista) => this.vinculados.set(lista),
      error: () => this.error.set('No se pudo cargar la lista de tutores'),
    });
    this.usuarios.listar().subscribe({
      next: (lista) => this.cuentas.set(lista.filter((u) => u.rol === 'Tutor')),
      error: () => undefined,
    });
  }

  protected iniciales(nombre: string): string {
    return nombre.charAt(0).toUpperCase();
  }

  protected agregar(): void {
    if (!this.puedeAgregar()) {
      return;
    }
    this.guardando.set(true);
    this.error.set(null);
    this.exito.set(null);
    this.pacientes
      .vincularTutor(this.pacienteId(), this.tutorElegido(), this.parentescoElegido())
      .subscribe({
        next: (lista) => {
          this.vinculados.set(lista);
          this.tutorElegido.set(0);
          this.parentescoElegido.set('');
          this.exito.set('Tutor vinculado. Ya puede ver a este niño o niña en su cuenta.');
          this.guardando.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.guardando.set(false);
          this.error.set(e.error?.mensaje ?? 'No se pudo vincular al tutor');
        },
      });
  }

  protected quitar(tutor: TutorVinculado): void {
    if (!confirm(`¿Quitar a ${tutor.nombre} de este niño o niña? Dejará de verlo en su cuenta.`)) {
      return;
    }
    this.error.set(null);
    this.exito.set(null);
    this.pacientes.desvincularTutor(this.pacienteId(), tutor.tutorId).subscribe({
      next: (lista) => {
        this.vinculados.set(lista);
        this.exito.set('Tutor quitado.');
      },
      error: (e: HttpErrorResponse) => this.error.set(e.error?.mensaje ?? 'No se pudo quitar al tutor'),
    });
  }
}