import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GestionarFlujoEvaluacionUseCase } from '../../application/gestionar-flujo-evaluacion.use-case';
import { ETIQUETA_ESTADO, DetalleEvaluacion } from '../../domain/flujo-evaluacion.model';
import { OPCIONES_RESPUESTA } from '../../domain/evaluacion.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { ErrorCampoComponent } from '../shared/error-campo.component';
import { FiltroEntradaDirective } from '../shared/filtro-entrada.directive';
import { textoValido } from '../shared/validadores';
import { ResultadoComponent } from './resultado.component';

@Component({
  selector: 'app-detalle-evaluacion',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    BotonAtrasComponent,
    ResultadoComponent,
    ErrorCampoComponent,
    FiltroEntradaDirective,
  ],
  templateUrl: './detalle-evaluacion.page.html',
  styleUrl: './flujo.scss',
})
export class DetalleEvaluacionPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly casoUso = inject(GestionarFlujoEvaluacionUseCase);

  protected readonly detalle = signal<DetalleEvaluacion | null>(null);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);
  protected readonly enviado = signal(false);
  protected readonly etiquetaEstado = ETIQUETA_ESTADO;

  protected readonly comentario = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(500), textoValido()],
  });

  ngOnInit(): void {
    this.enviado.set(!!this.route.snapshot.queryParamMap.get('enviado'));
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.casoUso.detalle(id).subscribe({
      next: (datos) => {
        this.detalle.set(datos);
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.error.set(e.error?.mensaje ?? 'No se pudo cargar la evaluación');
        this.cargando.set(false);
      },
    });
  }

  protected etiquetaRespuesta(valor: number): string {
    const opcion = OPCIONES_RESPUESTA.find((o) => o.valor === valor);
    return opcion ? `${opcion.emoji} ${opcion.etiqueta}` : String(valor);
  }

  protected aprobar(): void {
    const datos = this.detalle();
    if (!datos) {
      return;
    }
    if (this.comentario.invalid) {
      this.comentario.markAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set(null);
    this.casoUso.aprobar(datos.id, this.comentario.value).subscribe({
      next: (actualizado) => {
        this.detalle.set(actualizado);
        this.exito.set('Resultado aprobado. Ahora el tutor ya puede verlo.');
        this.guardando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudo aprobar el resultado');
      },
    });
  }
}