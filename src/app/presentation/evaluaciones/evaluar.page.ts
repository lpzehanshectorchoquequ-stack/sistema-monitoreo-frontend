import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionarEvaluacionesUseCase } from '../../application/gestionar-evaluaciones.use-case';
import { GestionarFlujoEvaluacionUseCase } from '../../application/gestionar-flujo-evaluacion.use-case';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Instrumento } from '../../domain/evaluacion.model';
import { EnvioRespuestas } from '../../domain/flujo-evaluacion.model';
import { Paciente, calcularEdad } from '../../domain/paciente.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { CarruselTestComponent } from './carrusel-test.component';

const ICONOS: Record<string, string> = { TDAH: '⚡', TEA: '🧩', APRENDIZAJE: '📚', OTRA: '🧠' };
const SUBTITULOS: Record<string, string> = {
  TDAH: 'Atención y energía',
  TEA: 'Comunicación y conducta',
  APRENDIZAJE: 'Lectura, escritura y matemáticas',
  OTRA: 'Evaluación general',
};

@Component({
  selector: 'app-evaluar',
  imports: [BotonAtrasComponent, CarruselTestComponent],
  templateUrl: './evaluar.page.html',
  styleUrl: './evaluar.page.scss',
})
export class EvaluarPage implements OnInit {
  private readonly evaluaciones = inject(GestionarEvaluacionesUseCase);
  private readonly flujo = inject(GestionarFlujoEvaluacionUseCase);
  private readonly pacientesCasoUso = inject(GestionarPacientesUseCase);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly paso = signal(1);
  protected readonly pacientes = signal<Paciente[]>([]);
  protected readonly instrumentos = signal<Instrumento[]>([]);
  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly elegido = signal<Instrumento | null>(null);
  protected readonly instrumento = signal<Instrumento | null>(null);
  protected readonly cargando = signal(false);
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly edad = calcularEdad;
  protected readonly nombresPasos = ['Paciente', 'Test', 'Cuestionario'];
  protected readonly puedeEnviarAlTutor = computed(() => this.elegido()?.quienResponde === 'Tutor');

  ngOnInit(): void {
    this.evaluaciones
      .listarInstrumentos()
      .subscribe((lista) => this.instrumentos.set(lista.filter((i) => i.totalPreguntas > 0)));
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

  protected avatar(p: Paciente): string {
    return p.genero === 'NINA' ? '👧' : p.genero === 'NINO' ? '👦' : '🧒';
  }

  protected icono(trastorno: string): string {
    return ICONOS[trastorno] ?? '📋';
  }

  protected subtitulo(trastorno: string): string {
    return SUBTITULOS[trastorno] ?? trastorno;
  }

  protected minutos(preguntas: number): number {
    return Math.max(1, Math.ceil(preguntas / 3));
  }

  protected elegirPaciente(paciente: Paciente): void {
    this.paciente.set(paciente);
    setTimeout(() => this.paso.set(2), 350);
  }

  protected elegirInstrumento(instrumento: Instrumento): void {
    this.elegido.set(instrumento);
    setTimeout(() => document.getElementById('modo')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }

  protected volver(): void {
    this.error.set(null);
    this.paso.update((p) => Math.max(1, p - 1));
  }

  protected enviarAlTutor(): void {
    const paciente = this.paciente();
    const elegido = this.elegido();
    if (!paciente || !elegido) {
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.flujo.asignar(paciente.id, elegido.id).subscribe({
      next: () => this.router.navigate(['/evaluaciones'], { queryParams: { asignada: 1 } }),
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudo enviar la evaluación al tutor');
      },
    });
  }

  protected responderAhora(): void {
    const elegido = this.elegido();
    if (!elegido) {
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.evaluaciones.obtenerInstrumento(elegido.id).subscribe({
      next: (completo) => {
        this.instrumento.set(completo);
        this.paso.set(3);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo cargar el cuestionario');
      },
    });
  }

  protected finalizar(envio: EnvioRespuestas): void {
    const instrumento = this.instrumento();
    const paciente = this.paciente();
    if (!instrumento || !paciente) {
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.evaluaciones
      .aplicar(paciente.id, {
        instrumentoId: instrumento.id,
        respuestas: envio.respuestas,
        observaciones: envio.observaciones,
      })
      .subscribe({
        next: (evaluacion) => this.router.navigateByUrl(`/evaluaciones/${evaluacion.id}`),
        error: (e: HttpErrorResponse) => {
          this.enviando.set(false);
          this.error.set(e.error?.mensaje ?? 'No se pudo guardar la evaluación');
        },
      });
  }
}