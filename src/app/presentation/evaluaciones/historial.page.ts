import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GestionarEvaluacionesUseCase } from '../../application/gestionar-evaluaciones.use-case';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { Evaluacion } from '../../domain/evaluacion.model';
import { Paciente } from '../../domain/paciente.model';
import { ResultadoComponent } from './resultado.component';
import { BotonAtrasComponent } from '../shared/boton-atras.component';

@Component({
  selector: 'app-historial',
  imports: [ResultadoComponent, RouterLink, BotonAtrasComponent],
  templateUrl: './historial.page.html',
})
export class HistorialPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly evaluaciones = inject(GestionarEvaluacionesUseCase);
  private readonly pacientes = inject(GestionarPacientesUseCase);

  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly lista = signal<Evaluacion[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pacientes.obtener(id).subscribe({
      next: (p) => this.paciente.set(p),
      error: () => this.error.set('No se pudo cargar el paciente'),
    });
    this.evaluaciones.historial(id).subscribe({
      next: (lista) => {
        this.lista.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el historial');
        this.cargando.set(false);
      },
    });
  }
}