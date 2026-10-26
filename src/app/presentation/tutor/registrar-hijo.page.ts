import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Psicologo } from '../../domain/paciente.model';
import { TemaService } from '../shared/tema.service';

@Component({
  selector: 'app-registrar-hijo',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registrar-hijo.page.html',
})
export class RegistrarHijoPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly casoUso = inject(GestionarPacientesUseCase);
  private readonly router = inject(Router);
  private readonly tema = inject(TemaService);

  protected readonly psicologos = signal<Psicologo[]>([]);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly hoy = new Date().toISOString().slice(0, 10);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    genero: ['', Validators.required],
    psicologoId: [0, [Validators.required, Validators.min(1)]],
    motivoConsulta: [''],
  });

  ngOnInit(): void {
    this.casoUso.psicologos().subscribe((lista) => {
      this.psicologos.set(lista);
      if (lista.length === 1) {
        this.form.controls.psicologoId.setValue(lista[0].id);
      }
    });
  }

  protected elegirGenero(genero: 'NINO' | 'NINA'): void {
    this.form.controls.genero.setValue(genero);
    this.tema.aplicar(genero);
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set(null);

    this.casoUso.registrarHijo(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/mis-hijos'),
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudo registrar a tu hijo/a');
      },
    });
  }
}