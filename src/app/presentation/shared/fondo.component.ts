import { Component, computed, inject } from '@angular/core';
import { Tema, TemaService } from './tema.service';

const EMOJIS: Record<Tema, string[]> = {
  NEUTRO: ['🧸', '🎈', '⭐', '🌈', '🧩', '🎨'],
  NINO: ['🚗', '🚙', '🏎️', '🚓', '🚀', '⭐'],
  NINA: ['⭐', '🎀', '🧸', '🦄', '🌸', '✨'],
};

@Component({
  selector: 'app-fondo',
  template: `
    <div class="fondo" aria-hidden="true">
      @for (e of elementos(); track $index) {
        <span
          class="el"
          [style.left.%]="e.izq"
          [style.font-size.rem]="e.tam"
          [style.animation-duration.s]="e.dur"
          [style.animation-delay.s]="e.retraso"
          >{{ e.emoji }}</span
        >
      }
    </div>
  `,
  styles: `
    .fondo {
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }
    .el {
      position: absolute;
      bottom: -10vh;
      opacity: 0.45;
      animation-name: subir;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    @keyframes subir {
      from {
        transform: translateY(0) rotate(0deg);
      }
      to {
        transform: translateY(-115vh) rotate(360deg);
      }
    }
  `,
})
export class FondoComponent {
  private readonly tema = inject(TemaService).tema;

  protected readonly elementos = computed(() => {
    const lista = EMOJIS[this.tema()];
    return Array.from({ length: 16 }, (_, i) => ({
      emoji: lista[i % lista.length],
      izq: (i * 37) % 100,
      tam: 1.6 + (i % 40) * 0.6,
      dur: 16 + ((i * 3) % 12),
      retraso: -(i * 2.7),
    }));
  });
}