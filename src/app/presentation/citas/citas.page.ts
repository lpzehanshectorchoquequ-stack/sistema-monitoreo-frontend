import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GestionarCitasUseCase } from '../../application/gestionar-citas.use-case';
import { SessionStore } from '../../application/session.store';
import { Cita, ETIQUETA_CITA } from '../../domain/cita.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { BuscadorComponent } from '../shared/buscador.component';
import { FiltroEntradaDirective } from '../shared/filtro-entrada.directive';
import { normalizar } from '../shared/texto';

type Pestana = 'RESPONDER' | 'PROXIMAS' | 'HISTORIAL';

@Component({
  selector: 'app-citas',
  imports: [RouterLink, BotonAtrasComponent, BuscadorComponent, FiltroEntradaDirective],
  templateUrl: './citas.page.html',
  styleUrl: './citas.scss',
})
export class CitasPage implements OnInit {
  private readonly casoUso = inject(GestionarCitasUseCase);
  private readonly route = inject(ActivatedRoute);

  protected readonly sesion = inject(SessionStore).sesion;
  protected readonly esTutor = computed(() => this.sesion()?.rol === 'Tutor');
  protected readonly esPsicologa = computed(() => this.sesion()?.rol === 'Psicologo');
  protected readonly etiqueta = ETIQUETA_CITA;

  protected readonly citas = signal<Cita[]>([]);
  protected readonly pestana = signal<Pestana>('PROXIMAS');
  protected readonly busqueda = signal('');
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);

  protected readonly panel = signal<{ cita: Cita; accion: string } | null>(null);
  protected readonly comentario = signal('');
  protected readonly costo = signal('');

  private readonly hoy = new Date().toLocaleDateString('en-CA');

  protected readonly porResponder = computed(() =>
    this.citas().filter((c) => c.acciones.includes('CONFIRMAR') || c.acciones.includes('ATENDIDA')),
  );

  protected readonly proximas = computed(() => {
    const pendientes = new Set(this.porResponder().map((c) => c.id));
    return this.citas().filter(
      (c) =>
        !pendientes.has(c.id) &&
        ['SOLICITADA', 'PROPUESTA', 'CONFIRMADA'].includes(c.estado) &&
        c.fecha >= this.hoy,
    );
  });

  protected readonly historial = computed(() => {
    const otras = new Set([...this.porResponder(), ...this.proximas()].map((c) => c.id));
    return this.citas()
      .filter((c) => !otras.has(c.id))
      .reverse();
  });

  protected readonly visibles = computed(() => {
    const lista =
      this.pestana() === 'RESPONDER' ? this.porResponder() : this.pestana() === 'PROXIMAS' ? this.proximas() : this.historial();
    const consulta = normalizar(this.busqueda());
    if (!consulta) {
      return lista;
    }
    return lista.filter(
      (c) => normalizar(c.pacienteNombre).includes(consulta) || normalizar(c.motivo).includes(consulta),
    );
  });

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('creada')) {
      this.exito.set(
        this.esTutor()
          ? '¡Listo! Tu solicitud de cita se envió. La psicóloga la confirmará y la verás aquí.'
          : '¡Listo! La propuesta de cita se envió al tutor. Cuando la acepte, quedará confirmada.',
      );
    }
    this.casoUso.listar().subscribe({
      next: (lista) => {
        this.citas.set(lista);
        this.pestana.set(this.porResponder().length > 0 ? 'RESPONDER' : 'PROXIMAS');
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de citas');
        this.cargando.set(false);
      },
    });
  }

  protected fechaDia(fecha: string): string {
    return fecha.slice(8, 10);
  }

  protected fechaMes(fecha: string): string {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es', { month: 'short', weekday: 'short' });
  }

  protected etiquetaAccion(cita: Cita, accion: string): string {
    switch (accion) {
      case 'CONFIRMAR':
        return cita.estado === 'PROPUESTA' ? '✓ Aceptar cita' : '✓ Confirmar';
      case 'RECHAZAR':
        return '✕ Rechazar';
      case 'CANCELAR':
        return 'Cancelar cita';
      case 'ATENDIDA':
        return '✔ Marcar como atendida';
      case 'NO_ASISTIO':
        return 'No asistió';
      default:
        return accion;
    }
  }

  protected claseAccion(accion: string): string {
    if (accion === 'CONFIRMAR' || accion === 'ATENDIDA') {
      return 'verde';
    }
    if (accion === 'RECHAZAR' || accion === 'CANCELAR') {
      return 'peligro';
    }
    return 'claro';
  }

  protected pedirAccion(cita: Cita, accion: string): void {
    this.error.set(null);
    this.exito.set(null);
    if (this.esPsicologa()) {
      this.panel.set({ cita, accion });
      this.comentario.set('');
      this.costo.set(accion === 'ATENDIDA' ? String(cita.costo) : '');
      return;
    }
    const mensajes: Record<string, string> = {
      CONFIRMAR: '¿Aceptar esta cita?',
      RECHAZAR: '¿Rechazar esta cita?',
      CANCELAR: '¿Cancelar esta cita? El espacio quedará libre para otras personas.',
    };
    if (confirm(mensajes[accion] ?? '¿Continuar?')) {
      this.enviar(cita, accion, '', null);
    }
  }

  protected cancelarPanel(): void {
    this.panel.set(null);
  }

  protected confirmarPanel(): void {
    const abierto = this.panel();
    if (!abierto) {
      return;
    }
    let costo: number | null = null;
    if (abierto.accion === 'ATENDIDA') {
      costo = Number(this.costo().replace(',', '.'));
      if (!Number.isFinite(costo) || costo < 0 || costo > 9999.99) {
        this.error.set('Escribe un costo válido, entre 0 y 9999.99');
        return;
      }
    }
    this.enviar(abierto.cita, abierto.accion, this.comentario(), costo);
  }

  private enviar(cita: Cita, accion: string, comentario: string, costo: number | null): void {
    this.casoUso.accion(cita.id, { accion, comentario, costo }).subscribe({
      next: (actualizada) => {
        this.citas.update((lista) => lista.map((c) => (c.id === actualizada.id ? actualizada : c)));
        this.panel.set(null);
        this.exito.set('Listo, la cita se actualizó.');
      },
      error: (e: HttpErrorResponse) => this.error.set(e.error?.mensaje ?? 'No se pudo completar la acción'),
    });
  }
}