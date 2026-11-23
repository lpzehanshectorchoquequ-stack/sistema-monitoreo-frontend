import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionarCitasUseCase } from '../../application/gestionar-citas.use-case';
import { GestionarPacientesUseCase } from '../../application/gestionar-pacientes.use-case';
import { SessionStore } from '../../application/session.store';
import { Espacio } from '../../domain/cita.model';
import { Paciente } from '../../domain/paciente.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { FiltroEntradaDirective } from '../shared/filtro-entrada.directive';

@Component({
  selector: 'app-nueva-cita',
  imports: [BotonAtrasComponent, FiltroEntradaDirective],
  templateUrl: './nueva-cita.page.html',
  styleUrl: './citas.scss',
})
export class NuevaCitaPage implements OnInit {
  private readonly citas = inject(GestionarCitasUseCase);
  private readonly pacientes = inject(GestionarPacientesUseCase);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly esTutor = inject(SessionStore).sesion()?.rol === 'Tutor';

  protected readonly hijos = signal<Paciente[]>([]);
  protected readonly hijo = signal<Paciente | null>(null);
  protected readonly espacios = signal<Espacio[]>([]);
  protected readonly cargandoEspacios = signal(false);
  protected readonly elegido = signal<Espacio | null>(null);
  protected readonly motivo = signal('');
  protected readonly urgente = signal(false);
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly sugerencias = [
    'Seguimiento',
    'Revisar los resultados de una evaluación',
    'Primera consulta',
    'Tengo una duda sobre mi hijo/a',
  ];

  protected readonly dias = computed(() => {
    const agrupados = new Map<string, Espacio[]>();
    for (const e of this.espacios()) {
      agrupados.set(e.fecha, [...(agrupados.get(e.fecha) ?? []), e]);
    }
    return [...agrupados.entries()].map(([fecha, lista]) => ({
      fecha,
      etiqueta: new Date(fecha + 'T00:00:00').toLocaleDateString('es', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
      espacios: lista,
    }));
  });

  protected readonly puedeEnviar = computed(
    () => this.elegido() !== null && this.motivo().trim().length >= 5 && !this.enviando(),
  );

  ngOnInit(): void {
    const fuente = this.esTutor ? this.pacientes.misHijos() : this.pacientes.listar();
    fuente.subscribe({
      next: (lista) => {
        this.hijos.set(lista);
        const idPedido = Number(this.route.snapshot.queryParamMap.get('paciente'));
        const elegido = lista.find((p) => p.id === idPedido) ?? (lista.length === 1 ? lista[0] : null);
        if (elegido) {
          this.elegirHijo(elegido);
        }
      },
      error: () => this.error.set('No se pudo cargar la lista de niños y niñas'),
    });
  }

  protected avatar(p: Paciente): string {
    return p.genero === 'NINA' ? '👧' : p.genero === 'NINO' ? '👦' : '🧒';
  }

  protected elegirHijo(paciente: Paciente): void {
    this.hijo.set(paciente);
    this.elegido.set(null);
    this.error.set(null);
    this.cargandoEspacios.set(true);
    this.citas.espaciosLibres(paciente.id).subscribe({
      next: (lista) => {
        this.espacios.set(lista);
        this.cargandoEspacios.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.cargandoEspacios.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudieron cargar los espacios libres');
      },
    });
  }

  protected usarSugerencia(texto: string): void {
    this.motivo.set(texto);
  }

  protected enviar(): void {
    const paciente = this.hijo();
    const espacio = this.elegido();
    if (!paciente || !espacio || !this.puedeEnviar()) {
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.citas
      .crear({
        pacienteId: paciente.id,
        fecha: espacio.fecha,
        horaInicio: espacio.horaInicio,
        motivo: this.motivo().trim(),
        urgente: this.urgente(),
      })
      .subscribe({
        next: () => this.router.navigate(['/citas'], { queryParams: { creada: 1 } }),
        error: (e: HttpErrorResponse) => {
          this.enviando.set(false);
          this.error.set(e.error?.mensaje ?? 'No se pudo enviar la cita');
          // El espacio pudo haberse ocupado: se actualiza la lista de libres
          this.elegirHijo(paciente);
        },
      });
  }
}