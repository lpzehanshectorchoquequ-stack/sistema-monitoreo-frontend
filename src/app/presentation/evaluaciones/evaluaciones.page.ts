import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GestionarFlujoEvaluacionUseCase } from '../../application/gestionar-flujo-evaluacion.use-case';
import { SessionStore } from '../../application/session.store';
import { ETIQUETA_NIVEL } from '../../domain/estadistica.model';
import { ETIQUETA_ESTADO, EstadoEvaluacion, ResumenEvaluacion } from '../../domain/flujo-evaluacion.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { BuscadorComponent } from '../shared/buscador.component';
import { normalizar } from '../shared/texto';

type Filtro = 'TODAS' | EstadoEvaluacion;

const ICONOS: Record<string, string> = { TDAH: '⚡', TEA: '🧩', APRENDIZAJE: '📚' };

@Component({
  selector: 'app-evaluaciones',
  imports: [RouterLink, BotonAtrasComponent, BuscadorComponent],
  templateUrl: './evaluaciones.page.html',
  styleUrl: './flujo.scss',
})
export class EvaluacionesPage implements OnInit {
  private readonly casoUso = inject(GestionarFlujoEvaluacionUseCase);
  private readonly route = inject(ActivatedRoute);

  protected readonly sesion = inject(SessionStore).sesion;
  protected readonly esTutor = computed(() => this.sesion()?.rol === 'Tutor');
  protected readonly lista = signal<ResumenEvaluacion[]>([]);
  protected readonly estado = signal<Filtro>('TODAS');
  protected readonly busqueda = signal('');
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);

  protected readonly etiquetaEstado = ETIQUETA_ESTADO;
  protected readonly etiquetaNivel = ETIQUETA_NIVEL;

  protected readonly conteo = computed(() => ({
    PENDIENTE: this.lista().filter((e) => e.estado === 'PENDIENTE').length,
    POR_REVISAR: this.lista().filter((e) => e.estado === 'POR_REVISAR').length,
    APROBADA: this.lista().filter((e) => e.estado === 'APROBADA').length,
  }));

  protected readonly visibles = computed(() => {
    const consulta = normalizar(this.busqueda());
    return this.lista().filter(
      (e) =>
        (this.estado() === 'TODAS' || e.estado === this.estado()) &&
        (!consulta ||
          normalizar(e.pacienteNombre).includes(consulta) ||
          normalizar(e.instrumentoNombre).includes(consulta)),
    );
  });

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('asignada')) {
      this.aviso.set('¡Listo! La evaluación se envió al tutor. Cuando la responda, te aparecerá aquí para revisarla.');
    }
    this.cargar();
  }

  protected icono(trastorno: string): string {
    return ICONOS[trastorno] ?? '🧠';
  }

  private cargar(): void {
    this.cargando.set(true);
    this.casoUso.listar().subscribe({
      next: (lista) => {
        this.lista.set(lista);
        const c = this.conteo();
        if (this.esTutor() && c.PENDIENTE > 0) {
          this.estado.set('PENDIENTE');
        } else if (!this.esTutor() && c.POR_REVISAR > 0) {
          this.estado.set('POR_REVISAR');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de evaluaciones');
        this.cargando.set(false);
      },
    });
  }

  protected cancelar(evaluacion: ResumenEvaluacion): void {
    if (!confirm(`¿Cancelar el envío de "${evaluacion.instrumentoNombre}" para ${evaluacion.pacienteNombre}?`)) {
      return;
    }
    this.error.set(null);
    this.casoUso.cancelar(evaluacion.id).subscribe({
      next: () => this.cargar(),
      error: (e: HttpErrorResponse) => this.error.set(e.error?.mensaje ?? 'No se pudo cancelar la evaluación'),
    });
  }
}