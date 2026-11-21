import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { GestionarTestsUseCase } from '../../application/gestionar-tests.use-case';
import { ETIQUETA_NIVEL } from '../../domain/estadistica.model';
import { AREAS_TEST, PreguntaTest, RESPONDEN, TestDetalle } from '../../domain/test.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { ErrorCampoComponent } from '../shared/error-campo.component';
import { FiltroEntradaDirective } from '../shared/filtro-entrada.directive';
import { nombreValido, textoValido } from '../shared/validadores';
import { etiquetaGrupo, textoCondicion } from './describir';

@Component({
  selector: 'app-test-editor',
  imports: [ReactiveFormsModule, BotonAtrasComponent, ErrorCampoComponent, FiltroEntradaDirective],
  templateUrl: './test-editor.page.html',
  styleUrl: './tests.scss',
})
export class TestEditorPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly casoUso = inject(GestionarTestsUseCase);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly id = signal<number | null>(null);
  protected readonly test = signal<TestDetalle | null>(null);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);
  protected readonly editando = signal<number | null>(null);

  protected readonly areas = AREAS_TEST;
  protected readonly responden = RESPONDEN;
  protected readonly etiquetaNivel = ETIQUETA_NIVEL;
  protected readonly grupo = etiquetaGrupo;
  protected readonly describir = textoCondicion;

  protected readonly totalPreguntas = computed(() => this.test()?.preguntas.length ?? 0);

  protected readonly formTest = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), textoValido()]],
    descripcion: ['', [Validators.maxLength(500), textoValido()]],
    trastorno: ['', Validators.required],
    quienResponde: ['', Validators.required],
    estadoValidacion: ['BORRADOR'],
  });

  protected readonly formPregunta = this.fb.nonNullable.group({
    texto: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300), textoValido()]],
    subescala: ['', [Validators.maxLength(30), nombreValido()]],
  });

  protected readonly formEdicion = this.fb.nonNullable.group({
    texto: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300), textoValido()]],
    subescala: ['', [Validators.maxLength(30), nombreValido()]],
  });

  protected readonly formUmbrales = this.fb.nonNullable.group({
    moderado: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    alto: [2, [Validators.required, Validators.min(2), Validators.max(100)]],
  });

  ngOnInit(): void {
    const idRuta = this.route.snapshot.paramMap.get('id');
    if (idRuta) {
      this.id.set(Number(idRuta));
      this.casoUso.obtener(Number(idRuta)).subscribe({
        next: (detalle) => this.aplicarDetalle(detalle, true),
        error: () => this.error.set('No se pudo cargar el test'),
      });
    }
  }

  private aplicarDetalle(detalle: TestDetalle, actualizarDatos: boolean): void {
    this.test.set(detalle);
    if (actualizarDatos) {
      this.formTest.patchValue({
        nombre: detalle.nombre,
        descripcion: detalle.descripcion ?? '',
        trastorno: detalle.trastorno,
        quienResponde: detalle.quienResponde,
        estadoValidacion: detalle.estadoValidacion,
      });
    }
    const total = detalle.preguntas.length;
    const moderado = detalle.umbralModerado ?? Math.max(1, Math.round(total * 0.35));
    const alto = detalle.umbralAlto ?? Math.max(moderado + 1, Math.round(total * 0.6));
    this.formUmbrales.setValue({ moderado, alto });
  }

  private manejar(peticion: Observable<TestDetalle>, mensaje: string, actualizarDatos = false): void {
    this.guardando.set(true);
    this.error.set(null);
    this.exito.set(null);
    peticion.subscribe({
      next: (detalle) => {
        this.aplicarDetalle(detalle, actualizarDatos);
        this.exito.set(mensaje);
        this.guardando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudo completar la acción');
      },
    });
  }

  protected elegirArea(valor: string): void {
    this.formTest.controls.trastorno.setValue(valor);
  }

  protected elegirResponde(valor: string): void {
    this.formTest.controls.quienResponde.setValue(valor);
  }

  protected elegirEstado(valor: string): void {
    this.formTest.controls.estadoValidacion.setValue(valor);
  }

  protected guardarDatos(): void {
    if (this.formTest.invalid) {
      this.formTest.markAllAsTouched();
      return;
    }
    const datos = this.formTest.getRawValue();
    const id = this.id();
    if (id === null) {
      this.guardando.set(true);
      this.error.set(null);
      this.casoUso.crear(datos).subscribe({
        next: (detalle) => this.router.navigateByUrl(`/tests/${detalle.id}`),
        error: (e: HttpErrorResponse) => {
          this.guardando.set(false);
          this.error.set(e.error?.mensaje ?? 'No se pudo crear el test');
        },
      });
    } else {
      this.manejar(this.casoUso.actualizar(id, datos), 'Cambios guardados', true);
    }
  }

  protected agregarPregunta(): void {
    const id = this.id();
    if (id === null || this.formPregunta.invalid) {
      this.formPregunta.markAllAsTouched();
      return;
    }
    this.manejar(
      this.casoUso
        .agregarPregunta(id, this.formPregunta.getRawValue())
        .pipe(tap(() => this.formPregunta.reset({ texto: '', subescala: '' }))),
      'Pregunta agregada',
    );
  }

  protected empezarEdicion(pregunta: PreguntaTest): void {
    this.editando.set(pregunta.id);
    this.formEdicion.setValue({ texto: pregunta.texto, subescala: pregunta.subescala === 'GENERAL' ? '' : etiquetaGrupo(pregunta.subescala) });
  }

  protected cancelarEdicion(): void {
    this.editando.set(null);
  }

  protected guardarEdicion(pregunta: PreguntaTest): void {
    const id = this.id();
    if (id === null || this.formEdicion.invalid) {
      this.formEdicion.markAllAsTouched();
      return;
    }
    this.manejar(
      this.casoUso
        .editarPregunta(id, pregunta.id, this.formEdicion.getRawValue())
        .pipe(tap(() => this.editando.set(null))),
      'Pregunta actualizada',
    );
  }

  protected quitarPregunta(pregunta: PreguntaTest): void {
    const id = this.id();
    if (id === null || !confirm('¿Quitar esta pregunta del test?')) {
      return;
    }
    this.manejar(this.casoUso.quitarPregunta(id, pregunta.id), 'Pregunta eliminada');
  }

  protected guardarUmbrales(): void {
    const id = this.id();
    if (id === null || this.formUmbrales.invalid) {
      this.formUmbrales.markAllAsTouched();
      return;
    }
    const { moderado, alto } = this.formUmbrales.getRawValue();
    if (alto <= moderado) {
      this.error.set('El umbral alto debe ser mayor que el umbral moderado');
      return;
    }
    this.manejar(this.casoUso.guardarUmbrales(id, moderado, alto), 'Umbrales guardados');
  }
}