import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConsultarEstadisticasUseCase } from '../../application/consultar-estadisticas.use-case';
import { SessionStore } from '../../application/session.store';
import { EstadisticasCitas } from '../../domain/estadistica-citas.model';
import { Conteo } from '../../domain/estadistica.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { GraficoComponent, SerieGrafico } from '../shared/grafico.component';
import { PdfCitasService } from '../shared/pdf-citas.service';

type Periodo = 'SEMANA' | 'MES' | 'TRIMESTRE';

const ETIQUETA_ESTADO: Record<string, string> = {
  ATENDIDA: 'Atendidas',
  CONFIRMADA: 'Confirmadas',
  PENDIENTE: 'Esperando respuesta',
  CANCELADA: 'Canceladas',
  NO_ASISTIO: 'No asistió',
};

const COLOR_ESTADO: Record<string, string> = {
  ATENDIDA: '#2bc48a',
  CONFIRMADA: '#4d9bff',
  PENDIENTE: '#f2a900',
  CANCELADA: '#b0bec5',
  NO_ASISTIO: '#ff5d5d',
};

@Component({
  selector: 'app-panel-citas',
  imports: [BotonAtrasComponent, GraficoComponent, RouterLink, RouterLinkActive],
  templateUrl: './panel-citas.page.html',
  styleUrl: './panel-citas.page.scss',
})
export class PanelCitasPage implements OnInit {
  private readonly casoUso = inject(ConsultarEstadisticasUseCase);
  private readonly pdf = inject(PdfCitasService);

  protected readonly sesion = inject(SessionStore).sesion;
  protected readonly esAdmin = computed(() => this.sesion()?.rol === 'Admin');
  protected readonly periodos: { valor: Periodo; nombre: string }[] = [
    { valor: 'SEMANA', nombre: 'Esta semana' },
    { valor: 'MES', nombre: 'Este mes' },
    { valor: 'TRIMESTRE', nombre: 'Últimos 3 meses' },
  ];

  protected readonly periodo = signal<Periodo>('MES');
  protected readonly datos = signal<EstadisticasCitas | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly graficoIngresos = viewChild<GraficoComponent>('graficoIngresos');

  private readonly etiquetasSemana = computed(() =>
    (this.datos()?.semanas ?? []).map((s) => s.desde.slice(8, 10) + '/' + s.desde.slice(5, 7)),
  );

  protected readonly citasSemanales = computed(() => {
    const semanas = this.datos()?.semanas ?? [];
    const series: SerieGrafico[] = [
      { nombre: 'Atendidas', datos: semanas.map((s) => s.atendidas), color: '#2bc48a' },
      { nombre: 'Canceladas', datos: semanas.map((s) => s.canceladas), color: '#ff9f43' },
      { nombre: 'No asistió', datos: semanas.map((s) => s.noAsistio), color: '#ff5d5d' },
    ];
    return { etiquetas: this.etiquetasSemana(), series };
  });

  protected readonly ingresosSemanales = computed(() => {
    const semanas = this.datos()?.semanas ?? [];
    const series: SerieGrafico[] = [
      { nombre: 'Ingresos (Bs)', datos: semanas.map((s) => s.ingresos), color: '#7c5cff' },
    ];
    return { etiquetas: this.etiquetasSemana(), series };
  });

  protected readonly estados = computed(() => this.preparar(this.datos()?.porEstado ?? [], ETIQUETA_ESTADO, COLOR_ESTADO));
  protected readonly dias = computed(() => this.preparar(this.datos()?.porDia ?? []));

  protected readonly ingresosPsicologas = computed(() => {
    const lista = this.datos()?.porPsicologa ?? [];
    const series: SerieGrafico[] = [
      { nombre: 'Ingresos (Bs)', datos: lista.map((p) => p.ingresos), color: '#2bc48a' },
    ];
    return { etiquetas: lista.map((p) => p.nombre), series };
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected cambiarPeriodo(periodo: Periodo): void {
    this.periodo.set(periodo);
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.casoUso.citas(this.periodo()).subscribe({
      next: (datos) => {
        this.datos.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las estadísticas de citas');
        this.cargando.set(false);
      },
    });
  }

  protected bs(valor: number): string {
    return 'Bs ' + valor.toFixed(2);
  }

  protected fecha(iso: string): string {
    return iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4);
  }

  protected descargarPdf(): void {
    const datos = this.datos();
    if (!datos) {
      return;
    }
    const etiqueta = this.periodos.find((p) => p.valor === this.periodo())?.nombre ?? '';
    this.pdf.generar(datos, etiqueta, this.esAdmin(), this.graficoIngresos()?.imagen() ?? null);
  }

  private preparar(conteos: Conteo[], nombres: Record<string, string> = {}, colores?: Record<string, string>) {
    const series: SerieGrafico[] = [
      {
        nombre: 'Cantidad',
        datos: conteos.map((c) => c.valor),
        colores: colores ? conteos.map((c) => colores[c.etiqueta] ?? '#b0bec5') : undefined,
      },
    ];
    return { etiquetas: conteos.map((c) => nombres[c.etiqueta] ?? c.etiqueta), series };
  }
}