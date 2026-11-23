import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ConsultarEstadisticasUseCase } from '../../application/consultar-estadisticas.use-case';
import { SessionStore } from '../../application/session.store';
import { Conteo, ETIQUETA_NIVEL, Resumen } from '../../domain/estadistica.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { GraficoComponent, SerieGrafico } from '../shared/grafico.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

const ETIQUETA_GENERO: Record<string, string> = { NINO: 'Niños', NINA: 'Niñas', SIN_DATO: 'Sin dato' };
const ETIQUETA_AREA: Record<string, string> = { TDAH: 'TDAH', TEA: 'TEA', APRENDIZAJE: 'Aprendizaje', OTRA: 'Otra' };
const COLOR_NIVEL: Record<string, string> = {
  SIN_INDICADORES: '#2e9e4f',
  MODERADO: '#f2a900',
  ALTO: '#d32f2f',
};
const COLOR_GENERO: Record<string, string> = { NINO: '#42a5f5', NINA: '#f06292', SIN_DATO: '#b0bec5' };

interface DatosGrafico {
  etiquetas: string[];
  series: SerieGrafico[];
}

function mesCorto(etiqueta: string): string {
  const [anio, mes] = etiqueta.split('-').map(Number);
  return new Date(anio, mes - 1, 1).toLocaleDateString('es', { month: 'short', year: '2-digit' });
}

@Component({
  selector: 'app-panel-estadisticas',
  imports: [BotonAtrasComponent, GraficoComponent, RouterLink, RouterLinkActive],
  templateUrl: './panel.page.html',
  styleUrl: './panel.page.scss',
})
export class PanelEstadisticasPage implements OnInit {
  private readonly casoUso = inject(ConsultarEstadisticasUseCase);

  protected readonly esAdmin = computed(() => this.sesion()?.rol === 'Admin');
  protected readonly sesion = inject(SessionStore).sesion;
  protected readonly resumen = signal<Resumen | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly porMes = computed(() => {
    const base = this.preparar(this.resumen()?.porMes ?? []);
    return { ...base, etiquetas: base.etiquetas.map(mesCorto) };
  });
  protected readonly porNivel = computed(() =>
    this.preparar(this.resumen()?.porNivel ?? [], ETIQUETA_NIVEL, COLOR_NIVEL),
  );
  protected readonly porArea = computed(() =>
    this.preparar(this.resumen()?.porTrastorno ?? [], ETIQUETA_AREA),
  );
  protected readonly porEdad = computed(() => this.preparar(this.resumen()?.porEdad ?? []));
  protected readonly porGenero = computed(() =>
    this.preparar(this.resumen()?.porGenero ?? [], ETIQUETA_GENERO, COLOR_GENERO),
  );
  protected readonly porPsicologa = computed(() => this.preparar(this.resumen()?.porPsicologa ?? []));

  ngOnInit(): void {
    this.casoUso.resumen().subscribe({
      next: (datos) => {
        this.resumen.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las estadísticas');
        this.cargando.set(false);
      },
    });
  }

  private preparar(
    conteos: Conteo[],
    nombres: Record<string, string> = {},
    colores?: Record<string, string>,
  ): DatosGrafico {
    return {
      etiquetas: conteos.map((c) => nombres[c.etiqueta] ?? c.etiqueta),
      series: [
        {
          nombre: 'Cantidad',
          datos: conteos.map((c) => c.valor),
          colores: colores ? conteos.map((c) => colores[c.etiqueta] ?? '#b0bec5') : undefined,
        },
      ],
    };
  }
}