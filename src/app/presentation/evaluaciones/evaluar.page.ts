import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GestionarEvaluacionesUseCase } from '../../application/gestionar-evaluaciones.use-case';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Evaluacion, Instrumento, OPCIONES_RESPUESTA } from '../../domain/evaluacion.model';
import { Paciente, calcularEdad } from '../../domain/paciente.model';
import { ResultadoComponent } from './resultado.component';

@Component({
  selector: 'app-evaluar',
  imports: [ResultadoComponent, RouterLink],
  templateUrl: './evaluar.page.html',
})
export class EvaluarPage implements OnInit {
  private readonly evaluaciones = inject(GestionarEvaluacionesUseCase);
  private readonly pacientesCasoUso = inject(GestionarPacientesUseCase);
  private readonly route = inject(ActivatedRoute);

  protected readonly paso = signal(1);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly instrumentos = signal<Instrumento[]>([]);
  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly instrumento = signal<Instrumento | null>(null);
  protected readonly respuestas = signal<Record<number, number>>({});
  protected readonly observaciones = signal('');
  protected readonly resultado = signal<Evaluacion | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly opciones = OPCIONES_RESPUESTA;
  protected readonly edad = calcularEdad;
  protected readonly nombresPasos = ['Paciente', 'Instrumento', 'Cuestionario', 'Resultado'];

  protected readonly contestadas = computed(() => Object.keys(this.respuestas()).length);
  protected readonly total = computed(() => this.instrumento()?.preguntas.length ?? 0);
  protected readonly completo = computed(() => this.total() > 0 && this.contestadas() === this.total());
  protected readonly porcentaje = computed(() =>
    this.total() === 0 ? 0 : Math.round((this.contestadas() / this.total()) * 100),
  );

  ngOnInit(): void {
    this.evaluaciones.listarInstrumentos().subscribe((lista) => this.instrumentos.set(lista));
    this.pacientesCasoUso.listar().subscribe({
      next: (lista) => {
        this.pacientes.set(lista);
        const id = Number(this.route.snapshot.queryParamMap.get('paciente'));
        const elegido = lista.find((p) => p.id === id);
        if (elegido) {
          this.elegirPaciente(elegido);
        }
      },
      error: () => this.error.set('No se pudo cargar la lista de pacientes'),
    });
  }

  protected elegirPaciente(paciente: Paciente): void {
    this.paciente.set(paciente);
    this.paso.set(2);
  }

  protected elegirInstrumento(instrumento: Instrumento): void {
    this.cargando.set(true);
    this.error.set(null);
    this.evaluaciones.obtenerInstrumento(instrumento.id).subscribe({
      next: (completo) => {
        this.instrumento.set(completo);
        this.respuestas.set({});
        this.observaciones.set('');
        this.paso.set(3);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo cargar el cuestionario');
      },
    });
  }

  protected responder(preguntaId: number, valor: number): void {
    this.respuestas.update((actual) => ({ ...actual, [preguntaId]: valor }));
  }

  protected volver(): void {
    this.error.set(null);
    this.paso.update((p) => Math.max(1, p - 1));
  }

  protected enviar(): void {
    const instrumento = this.instrumento();
    const paciente = this.paciente();
    if (!instrumento || !paciente || !this.completo()) {
      return;
    }
    this.cargando.set(true);
    this.error.set(null);

    const datos = {
      instrumentoId: instrumento.id,
      respuestas: Object.entries(this.respuestas()).map(([id, valor]) => ({
        preguntaId: Number(id),
        valor,
      })),
      observaciones: this.observaciones(),
    };

    this.evaluaciones.aplicar(paciente.id, datos).subscribe({
      next: (evaluacion) => {
        this.resultado.set(evaluacion);
        this.paso.set(4);
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudo guardar la evaluación');
      },
    });
  }

  protected nueva(): void {
    this.paciente.set(null);
    this.instrumento.set(null);
    this.respuestas.set({});
    this.resultado.set(null);
    this.error.set(null);
    this.paso.set(1);
  }
}