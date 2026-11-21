import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultarEstadisticasUseCase } from '../../application/consultar-estadisticas.use-case';
import { ETIQUETA_NIVEL, Evolucion } from '../../domain/estadistica.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { GraficoComponent, SerieGrafico } from '../shared/grafico.component';
import { PdfEvolucionService } from '../shared/pdf-evolucion.service';

type TipoResumen = 'mejora' | 'estable' | 'sube' | 'unico';

@Component({
  selector: 'app-evolucion',
  imports: [BotonAtrasComponent, GraficoComponent],
  templateUrl: './evolucion.page.html',
  styleUrl: './evolucion.page.scss',
})
export class EvolucionPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly casoUso = inject(ConsultarEstadisticasUseCase);
  private readonly pdf = inject(PdfEvolucionService);

  protected readonly evolucion = signal<Evolucion | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly desde = signal('');
  protected readonly hasta = signal('');
  protected readonly grafico = viewChild(GraficoComponent);
  protected readonly etiquetaNivel = ETIQUETA_NIVEL;

  protected readonly puntos = computed(() => {
    const datos = this.evolucion();
    if (!datos) {
      return [];
    }
    return datos.puntos.filter(
      (p) => (!this.desde() || p.fecha >= this.desde()) && (!this.hasta() || p.fecha <= this.hasta()),
    );
  });

  private readonly fechas = computed(() => [...new Set(this.puntos().map((p) => p.fecha))].sort());

  protected readonly etiquetasGrafico = computed(() =>
    this.fechas().map((f) => f.slice(8, 10) + '/' + f.slice(5, 7)),
  );

  protected readonly series = computed<SerieGrafico[]>(() => {
    const nombres = [...new Set(this.puntos().map((p) => p.instrumento))];
    return nombres.map((nombre) => ({
      nombre,
      datos: this.fechas().map((fecha) => {
        const delDia = this.puntos().filter((p) => p.instrumento === nombre && p.fecha === fecha);
        return delDia.length ? delDia[delDia.length - 1].porcentaje : null;
      }),
    }));
  });

  protected readonly resumenes = computed(() => {
    const nombres = [...new Set(this.puntos().map((p) => p.instrumento))];
    return nombres.map((nombre) => {
      const lista = this.puntos().filter((p) => p.instrumento === nombre);
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      const cambio = ultimo.porcentaje - primero.porcentaje;

      let tipo: TipoResumen;
      let mensaje: string;
      if (lista.length < 2) {
        tipo = 'unico';
        mensaje = 'Hay una sola evaluación. Con la siguiente se podrá ver cómo evoluciona.';
      } else if (cambio <= -10) {
        tipo = 'mejora';
        mensaje = `Los indicadores bajaron ${Math.abs(cambio)} puntos desde la primera evaluación.`;
      } else if (cambio >= 10) {
        tipo = 'sube';
        mensaje = `Los indicadores subieron ${cambio} puntos desde la primera evaluación. Conviene comentarlo con la psicóloga.`;
      } else {
        tipo = 'estable';
        mensaje = 'Los indicadores se mantienen parecidos a los de la primera evaluación.';
      }
      return { nombre, primero: primero.porcentaje, ultimo: ultimo.porcentaje, total: lista.length, tipo, mensaje };
    });
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.casoUso.evolucion(id).subscribe({
      next: (datos) => {
        this.evolucion.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la evolución. Verifica que tengas acceso a este niño o niña.');
        this.cargando.set(false);
      },
    });
  }

  protected quitarFiltro(): void {
    this.desde.set('');
    this.hasta.set('');
  }

  protected descargarPdf(): void {
    const datos = this.evolucion();
    if (!datos) {
      return;
    }
    this.pdf.generar(datos, this.puntos(), this.grafico()?.imagen() ?? null, this.desde(), this.hasta());
  }
}