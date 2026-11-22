import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GestionarFlujoEvaluacionUseCase } from '../../application/gestionar-flujo-evaluacion.use-case';
import { DetalleEvaluacion, EnvioRespuestas } from '../../domain/flujo-evaluacion.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { CarruselTestComponent } from './carrusel-test.component';

@Component({
  selector: 'app-responder-evaluacion',
  imports: [RouterLink, BotonAtrasComponent, CarruselTestComponent],
  templateUrl: './responder-evaluacion.page.html',
  styleUrl: './flujo.scss',
})
export class ResponderEvaluacionPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly casoUso = inject(GestionarFlujoEvaluacionUseCase);

  protected readonly detalle = signal<DetalleEvaluacion | null>(null);
  protected readonly cargando = signal(true);
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  private id = 0;

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.casoUso.detalle(this.id).subscribe({
      next: (datos) => {
        this.detalle.set(datos);
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.error.set(e.error?.mensaje ?? 'No se pudo cargar el test');
        this.cargando.set(false);
      },
    });
  }

  protected enviar(envio: EnvioRespuestas): void {
    this.enviando.set(true);
    this.error.set(null);
    this.casoUso.responder(this.id, envio).subscribe({
      next: () => this.router.navigate(['/evaluaciones', this.id], { queryParams: { enviado: 1 } }),
      error: (e: HttpErrorResponse) => {
        this.enviando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudieron enviar las respuestas. Inténtalo otra vez.');
      },
    });
  }
}