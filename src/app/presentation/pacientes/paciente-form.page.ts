import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Tutor } from '../../domain/paciente.model';

@Component({
  selector: 'app-paciente-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './paciente-form.page.html',
})
export class PacienteFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly casoUso = inject(GestionarPacientesUseCase);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly id = signal<number | null>(null);
  protected readonly tutores = signal<Tutor[]>([]);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly hoy = new Date().toISOString().slice(0, 10);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    motivoConsulta: [''],
    tutorId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.casoUso.tutores().subscribe((lista) => this.tutores.set(lista));

    const idRuta = this.route.snapshot.paramMap.get('id');
    if (idRuta) {
      this.id.set(Number(idRuta));
      this.casoUso.obtener(Number(idRuta)).subscribe({
        next: (p) =>
          this.form.patchValue({
            nombre: p.nombre,
            fechaNacimiento: p.fechaNacimiento,
            motivoConsulta: p.motivoConsulta ?? '',
            tutorId: p.tutorId ?? 0,
          }),
        error: () => this.error.set('No se pudo cargar el paciente'),
      });
    }
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set(null);

    const datos = this.form.getRawValue();
    const id = this.id();
    const peticion = id === null ? this.casoUso.crear(datos) : this.casoUso.actualizar(id, datos);

    peticion.subscribe({
      next: () => this.router.navigateByUrl('/pacientes'),
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudo guardar el paciente');
      },
    });
  }
}