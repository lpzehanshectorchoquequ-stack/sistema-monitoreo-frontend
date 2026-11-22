import { Component, input } from '@angular/core';
import { Conclusion } from '../../domain/evaluacion.model';
import { AreaResultado } from '../../domain/flujo-evaluacion.model';
import { etiquetaGrupo } from '../tests/describir';

const ETIQUETAS: Record<string, string> = {
  ALTO: 'Indicadores altos',
  MODERADO: 'Indicadores moderados',
  SIN_INDICADORES: 'Sin indicadores significativos',
};

const ICONOS: Record<string, string> = { ALTO: '🔴', MODERADO: '🟡', SIN_INDICADORES: '🟢' };

const SIGNIFICADO: Record<string, string> = {
  ALTO:
    'Se observaron varias situaciones que ocurren con frecuencia en este tema. Esto no es un diagnóstico: significa que conviene hacer una evaluación más a fondo con la psicóloga.',
  MODERADO:
    'Se observaron algunas situaciones frecuentes. Conviene seguir observando en distintos lugares (casa, escuela) y repetir la evaluación más adelante.',
  SIN_INDICADORES:
    'No se observaron señales importantes con este test. Eso no descarta nada por sí solo: si hay dudas, se pueden comentar con la psicóloga.',
};

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
  selector: 'app-resultado',
  template: `
    @if (conclusion(); as c) {
      <div [class]="'res nivel-' + c.nivel">
        <div class="res-cab">
          <span class="res-icono">{{ icono(c.nivel) }}</span>
          <div>
            <small>Resultado · {{ c.trastorno }}</small>
            <h3>{{ etiqueta(c.nivel) }}</h3>
          </div>
        </div>
        <p class="res-que">{{ queSignifica(c.nivel) }}</p>

        @if (areas().length > 0) {
          <h4>¿En qué áreas se observan señales?</h4>
          <div class="res-areas">
            @for (a of areas(); track a.nombre) {
              <div class="res-area">
                <div class="res-area-cab">
                  <strong>{{ nombreArea(a.nombre) }}</strong>
                  <span>{{ a.sintomas }} de {{ a.totalPreguntas }} situaciones frecuentes</span>
                </div>
                <div class="res-barra"><div [style.width.%]="a.porcentaje"></div></div>
              </div>
            }
          </div>
        }

        <h4>Recomendación</h4>
        <p class="res-reco">{{ c.recomendacion }}</p>

        <details class="res-detalle">
          <summary>¿Cómo se llegó a este resultado?</summary>
          <ol>
            @for (linea of c.explicacion; track $index) {
              <li>{{ linea }}</li>
            }
          </ol>
        </details>
        <small class="res-nota">Indicador de apoyo: la decisión clínica corresponde siempre a la psicóloga.</small>
      </div>
    }
  `,
  styles: `
    .res {
      padding: 1.4rem 1.5rem;
      margin: 0.6rem 0;
      border-left: 8px solid;
      border-radius: 20px;
    }
    .nivel-ALTO {
      background: #fff0f1;
      border-color: #d32f2f;
    }
    .nivel-MODERADO {
      background: #fff8e1;
      border-color: #f2a900;
    }
    .nivel-SIN_INDICADORES {
      background: #ecf9ef;
      border-color: #2e9e4f;
    }
    .res-cab {
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }
    .res-icono {
      font-size: 2.4rem;
    }
    .res-cab h3 {
      margin: 0;
      font-size: 1.5rem;
    }
    .res-que {
      margin: 0.9rem 0;
      font-size: 1.1rem;
      line-height: 1.5;
    }
    h4 {
      margin: 1.1rem 0 0.5rem;
    }
    .res-areas {
      display: grid;
      gap: 0.8rem;
    }
    .res-area-cab {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.4rem;
      margin-bottom: 0.3rem;
    }
    .res-area-cab span {
      color: #666;
      font-size: 0.92rem;
    }
    .res-barra {
      height: 14px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.09);
      border-radius: 999px;
    }
    .res-barra div {
      height: 100%;
      background: linear-gradient(90deg, #4cc38a, #f2a900, #d32f2f);
      background-size: 100vw 100%;
      border-radius: 999px;
    }
    .res-reco {
      margin: 0;
      padding: 0.9rem 1.1rem;
      line-height: 1.5;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 14px;
    }
    .res-detalle {
      margin-top: 1rem;
    }
    .res-detalle summary {
      cursor: pointer;
      font-weight: 800;
    }
    .res-detalle li {
      margin: 0.35rem 0;
      font-size: 0.88rem;
      overflow-wrap: anywhere;
    }
    .res-nota {
      display: block;
      margin-top: 0.9rem;
      opacity: 0.7;
    }
  `,
})
export class ResultadoComponent {
  readonly conclusion = input.required<Conclusion>();
  readonly areas = input<AreaResultado[]>([]);

  protected etiqueta(nivel: string): string {
    return ETIQUETAS[nivel] ?? nivel;
  }

  protected icono(nivel: string): string {
    return ICONOS[nivel] ?? '⚪';
  }

  protected queSignifica(nivel: string): string {
    return SIGNIFICADO[nivel] ?? '';
  }

  protected nombreArea(nombre: string): string {
    return AREAS[nombre] ?? etiquetaGrupo(nombre);
  }
}