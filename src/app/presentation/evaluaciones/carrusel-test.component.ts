import { Component, computed, input, output, signal } from '@angular/core';
import { OPCIONES_RESPUESTA, PreguntaInstrumento } from '../../domain/evaluacion.model';
import { EnvioRespuestas } from '../../domain/flujo-evaluacion.model';
import { FiltroEntradaDirective } from '../shared/filtro-entrada.directive';
import { etiquetaGrupo } from '../tests/describir';

const AREAS: Record<string, string> = {
  INATENCION: 'Atención',
  HIPERACTIVIDAD: 'Actividad',
  SOCIAL: 'Social',
  REPETITIVO: 'Rutinas',
  LECTURA: 'Lectura',
  ESCRITURA: 'Escritura',
  MATEMATICAS: 'Matemáticas',
};

@Component({
  selector: 'app-carrusel-test',
  imports: [FiltroEntradaDirective],
  templateUrl: './carrusel-test.component.html',
  styleUrl: './carrusel-test.component.scss',
})
export class CarruselTestComponent {
  readonly preguntas = input.required<PreguntaInstrumento[]>();
  readonly enviando = input(false);
  readonly finalizar = output<EnvioRespuestas>();

  protected readonly opciones = OPCIONES_RESPUESTA;
  protected readonly indice = signal(0);
  protected readonly respuestas = signal<Record<number, number>>({});
  protected readonly revision = signal(false);
  protected readonly cambiadas = signal<number[]>([]);
  protected readonly editando = signal<number | null>(null);
  protected readonly observaciones = signal('');
  protected readonly bloqueado = signal(false);

  protected readonly total = computed(() => this.preguntas().length);
  protected readonly cambiosRestantes = computed(() => 2 - this.cambiadas().length);
  protected readonly progreso = computed(() =>
    this.total() === 0 ? 0 : Math.round((this.indice() / this.total()) * 100),
  );

  // Una lista de un solo elemento: así cada pregunta se dibuja de nuevo con su animación
  protected readonly unaPregunta = computed(() => {
    const pregunta = this.preguntas()[this.indice()];
    return pregunta ? [pregunta] : [];
  });

  protected area(subescala: string): string {
    return AREAS[subescala] ?? etiquetaGrupo(subescala);
  }

  protected etiqueta(valor: number | undefined): string {
    return this.opciones.find((o) => o.valor === valor)?.etiqueta ?? '';
  }

  protected emoji(valor: number | undefined): string {
    return this.opciones.find((o) => o.valor === valor)?.emoji ?? '';
  }

  protected responder(preguntaId: number, valor: number): void {
    if (this.bloqueado()) {
      return;
    }
    this.respuestas.update((actual) => ({ ...actual, [preguntaId]: valor }));
    this.bloqueado.set(true);

    // Una breve pausa para que se vea la opción marcada antes de pasar a la siguiente
    setTimeout(() => {
      if (this.indice() + 1 >= this.total()) {
        this.revision.set(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        this.indice.update((i) => i + 1);
      }
      this.bloqueado.set(false);
    }, 450);
  }

  protected fueCambiada(preguntaId: number): boolean {
    return this.cambiadas().includes(preguntaId);
  }

  protected puedeCambiar(preguntaId: number): boolean {
    return this.fueCambiada(preguntaId) || this.cambiosRestantes() > 0;
  }

  protected abrirCambio(preguntaId: number): void {
    this.editando.set(this.editando() === preguntaId ? null : preguntaId);
  }

  protected elegirCambio(preguntaId: number, valor: number): void {
    if (this.respuestas()[preguntaId] !== valor) {
      this.respuestas.update((actual) => ({ ...actual, [preguntaId]: valor }));
      if (!this.fueCambiada(preguntaId)) {
        this.cambiadas.update((lista) => [...lista, preguntaId]);
      }
    }
    this.editando.set(null);
  }

  protected enviar(): void {
    this.finalizar.emit({
      respuestas: this.preguntas().map((p) => ({ preguntaId: p.id, valor: this.respuestas()[p.id] })),
      cambios: this.cambiadas().length,
      observaciones: this.observaciones(),
    });
  }
}