import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export interface SerieGrafico {
  nombre: string;
  datos: (number | null)[];
  color?: string;
  colores?: string[];
}

export interface ImagenGrafico {
  url: string;
  ancho: number;
  alto: number;
}

const PALETA = ['#7c5cff', '#ff9f43', '#2bc48a', '#ff5d5d', '#4d9bff', '#e0407f'];

@Component({
  selector: 'app-grafico',
  template: `<div class="marco"><canvas #lienzo></canvas></div>`,
  styles: `
    .marco {
      position: relative;
      height: 300px;
    }
  `,
})
export class GraficoComponent implements OnDestroy {
  readonly tipo = input<'bar' | 'line' | 'doughnut'>('bar');
  readonly etiquetas = input.required<string[]>();
  readonly series = input.required<SerieGrafico[]>();
  readonly maximoY = input<number | null>(null);

  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');
  private readonly listo = signal(false);
  private grafico: Chart | null = null;

  constructor() {
    afterNextRender(() => this.listo.set(true));
    effect(() => {
      if (!this.listo()) {
        return;
      }
      this.dibujar(this.tipo(), this.etiquetas(), this.series(), this.maximoY());
    });
  }

  imagen(): ImagenGrafico | null {
    if (!this.grafico) {
      return null;
    }
    const lienzo = this.grafico.canvas;
    return { url: this.grafico.toBase64Image(), ancho: lienzo.width, alto: lienzo.height };
  }

  ngOnDestroy(): void {
    this.grafico?.destroy();
  }

  private dibujar(
    tipo: 'bar' | 'line' | 'doughnut',
    etiquetas: string[],
    series: SerieGrafico[],
    maximoY: number | null,
  ): void {
    this.grafico?.destroy();
    const circular = tipo === 'doughnut';

    const datasets = series.map((serie, i) => {
      const color = serie.color ?? PALETA[i % PALETA.length];
      return {
        label: serie.nombre,
        data: serie.datos,
        backgroundColor: circular ? (serie.colores ?? PALETA) : tipo === 'line' ? color + '33' : color,
        borderColor: circular ? '#ffffff' : color,
        borderWidth: 3,
        borderRadius: tipo === 'bar' ? 8 : 0,
        tension: 0.3,
        spanGaps: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      };
    });

    const configuracion = {
      type: tipo,
      data: { labels: etiquetas, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: circular || series.length > 1, position: 'bottom' } },
        scales: circular
          ? {}
          : { y: { beginAtZero: true, max: maximoY ?? undefined, ticks: { precision: 0 } } },
      },
    } as unknown as ChartConfiguration;

    this.grafico = new Chart(this.lienzo().nativeElement, configuracion);
  }
}