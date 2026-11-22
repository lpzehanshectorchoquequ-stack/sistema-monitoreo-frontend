import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Tutor } from '../../domain/paciente.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { ErrorCampoComponent } from '../shared/error-campo.component';
import { FiltroEntradaDirective } from '../shared/filtro-entrada.directive';
import {
  fechaNacimientoValida,
  nombreValido,
  rangoFechaNacimiento,
  textoValido,
} from '../shared/validadores';

@Component({
  selector: 'app-paciente-form',
  imports: [ReactiveFormsModule, RouterLink, BotonAtrasComponent, ErrorCampoComponent, FiltroEntradaDirective],
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
  protected readonly rango = rangoFechaNacimiento();

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, nombreValido(), Validators.maxLength(100)]],
    apellido: ['', [Validators.required, nombreValido(), Validators.maxLength(100)]],
    fechaNacimiento: ['', [Validators.required, fechaNacimientoValida()]],
    genero: [''],
    motivoConsulta: ['', [textoValido(), Validators.maxLength(500)]],
    tutorId: [0, [Validators.required, Validators.min(1)]],
    fortalezas: ['', [textoValido(), Validators.maxLength(500)]],
    dificultades: ['', [textoValido(), Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.casoUso.tutores().subscribe((lista) => this.tutores.set(lista));

    const idRuta = this.route.snapshot.paramMap.get('id');
    if (idRuta) {
      this.id.set(Number(idRuta));
      this.casoUso.obtener(Number(idRuta)).subscribe({
        next: (p) =>
          this.form.patchValue({
            nombre: p.nombrePila,
            apellido: p.apellido,
            fechaNacimiento: p.fechaNacimiento,
            genero: p.genero ?? '',
            motivoConsulta: p.motivoConsulta ?? '',
            tutorId: p.tutorId ?? 0,
            fortalezas: p.fortalezas ?? '',
            dificultades: p.dificultades ?? '',
          }),
        error: () => this.error.set('No se pudo cargar el paciente'),
      });
    }
  }

  protected elegirGenero(genero: string): void {
    this.form.controls.genero.setValue(genero);
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