import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionarCitasUseCase } from '../../application/gestionar-citas.use-case';
import { GestionarFlujoEvaluacionUseCase } from '../../application/gestionar-flujo-evaluacion.use-case';
import { SessionStore } from '../../application/session.store';
import { Cita } from '../../domain/cita.model';
import { ResumenEvaluacion } from '../../domain/flujo-evaluacion.model';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.page.html',
})
export class InicioPage implements OnInit {
  private readonly evaluaciones = inject(GestionarFlujoEvaluacionUseCase);
  private readonly citasCasoUso = inject(GestionarCitasUseCase);

  protected readonly sesion = inject(SessionStore).sesion;
  protected readonly lista = signal<ResumenEvaluacion[]>([]);
  protected readonly citas = signal<Cita[]>([]);

  protected readonly pendientes = computed(() => this.lista().filter((e) => e.estado === 'PENDIENTE').length);
  protected readonly porRevisar = computed(() => this.lista().filter((e) => e.estado === 'POR_REVISAR').length);
  protected readonly citasPorResponder = computed(
    () => this.citas().filter((c) => c.acciones.includes('CONFIRMAR')).length,
  );
  protected readonly citasPorAtender = computed(
    () => this.citas().filter((c) => c.acciones.includes('ATENDIDA')).length,
  );

  ngOnInit(): void {
    const rol = this.sesion()?.rol;
    if (rol === 'Psicologo' || rol === 'Tutor') {
      this.evaluaciones.listar().subscribe({ next: (l) => this.lista.set(l), error: () => undefined });
      this.citasCasoUso.listar().subscribe({ next: (l) => this.citas.set(l), error: () => undefined });
    }
  }
}