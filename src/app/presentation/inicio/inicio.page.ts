import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionarFlujoEvaluacionUseCase } from '../../application/gestionar-flujo-evaluacion.use-case';
import { SessionStore } from '../../application/session.store';
import { ResumenEvaluacion } from '../../domain/flujo-evaluacion.model';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.page.html',
})
export class InicioPage implements OnInit {
  private readonly casoUso = inject(GestionarFlujoEvaluacionUseCase);

  protected readonly sesion = inject(SessionStore).sesion;
  protected readonly lista = signal<ResumenEvaluacion[]>([]);
  protected readonly pendientes = computed(() => this.lista().filter((e) => e.estado === 'PENDIENTE').length);
  protected readonly porRevisar = computed(() => this.lista().filter((e) => e.estado === 'POR_REVISAR').length);

  ngOnInit(): void {
    const rol = this.sesion()?.rol;
    if (rol === 'Psicologo' || rol === 'Tutor') {
      this.casoUso.listar().subscribe({ next: (lista) => this.lista.set(lista), error: () => undefined });
    }
  }
}