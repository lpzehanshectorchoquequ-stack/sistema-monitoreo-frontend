import { Component, input } from '@angular/core';
import { Conclusion } from '../../domain/evaluacion.model';

const ETIQUETAS: Record<string, string> = {
  ALTO: 'Indicadores altos',
  MODERADO: 'Indicadores moderados',
  SIN_INDICADORES: 'Sin indicadores significativos',
};

const ICONOS: Record<string, string> = {
  ALTO: '🔴',
  MODERADO: '🟡',
  SIN_INDICADORES: '🟢',
};

@Component({
  selector: 'app-resultado',
  template: `
    @if (conclusion(); as c) {
      <div class="resultado" [class]="'nivel-' + c.nivel">
        <div class="cabecera">
          <span class="icono">{{ icono(c.nivel) }}</span>
          <div>
            <strong>{{ c.trastorno }}</strong>
            <div class="nivel">{{ etiqueta(c.nivel) }}</div>
          </div>
        </div>
        <p class="reco">{{ c.recomendacion }}</p>
        <details>
          <summary>¿Por qué este resultado?</summary>
          <ol>
            @for (linea of c.explicacion; track $index) {
              <li>{{ linea }}</li>
            }
          </ol>
        </details>
        <small class="nota">Indicador de apoyo: la decisión clínica corresponde siempre a la psicóloga.</small>
      </div>
    }
  `,
  styles: `
    .resultado {
      padding: 1.1rem 1.2rem;
      margin: 0.8rem 0;
      border-radius: 16px;
      border-left: 6px solid;
    }
    .nivel-ALTO {
      background: #ffe9ec;
      border-color: #d32f2f;
    }
    .nivel-MODERADO {
      background: #fff6dc;
      border-color: #f2a900;
    }
    .nivel-SIN_INDICADORES {
      background: #e6f7ea;
      border-color: #2e9e4f;
    }
    .cabecera {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }
    .icono {
      font-size: 1.8rem;
    }
    .nivel {
      font-size: 0.95rem;
      opacity: 0.85;
    }
    .reco {
      margin: 0.8rem 0;
    }
    details {
      margin-top: 0.4rem;
    }
    summary {
      cursor: pointer;
      font-weight: 700;
    }
    li {
      margin: 0.35rem 0;
      font-size: 0.88rem;
      overflow-wrap: anywhere;
    }
    .nota {
      display: block;
      margin-top: 0.8rem;
      opacity: 0.7;
    }
  `,
})
export class ResultadoComponent {
  readonly conclusion = input.required<Conclusion>();

  protected etiqueta(nivel: string): string {
    return ETIQUETAS[nivel] ?? nivel;
  }

  protected icono(nivel: string): string {
    return ICONOS[nivel] ?? '⚪';
  }
}