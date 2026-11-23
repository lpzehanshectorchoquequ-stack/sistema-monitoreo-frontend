import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { GestionarCitasUseCase } from '../../application/gestionar-citas.use-case';
import { DIAS, Horario, MisHorarios } from '../../domain/cita.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';

function generarHoras(): string[] {
  const horas: string[] = [];
  for (let h = 6; h <= 22; h++) {
    const hora = String(h).padStart(2, '0');
    horas.push(`${hora}:00`);
    if (h < 22) {
      horas.push(`${hora}:30`);
    }
  }
  return horas;
}

function minutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

@Component({
  selector: 'app-horarios',
  imports: [BotonAtrasComponent],
  templateUrl: './horarios.page.html',
  styleUrl: './citas.scss',
})
export class HorariosPage implements OnInit {
  private readonly casoUso = inject(GestionarCitasUseCase);

  protected readonly dias = DIAS;
  protected readonly horas = generarHoras();
  protected readonly duraciones = [30, 45, 60, 90];

  protected readonly datos = signal<MisHorarios | null>(null);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);

  protected readonly dia = signal(1);
  protected readonly inicio = signal('08:00');
  protected readonly fin = signal('12:00');
  protected readonly duracion = signal(45);
  protected readonly tarifa = signal('0');

  protected readonly porDia = computed(() =>
    this.dias.map((nombre, i) => ({
      dia: i + 1,
      nombre,
      bloques: (this.datos()?.horarios ?? []).filter((h) => h.diaSemana === i + 1),
    })),
  );

  protected readonly totalBloques = computed(() => this.datos()?.horarios.length ?? 0);

  ngOnInit(): void {
    this.casoUso.misHorarios().subscribe({
      next: (datos) => this.aplicar(datos),
      error: () => {
        this.error.set('No se pudieron cargar tus horarios');
        this.cargando.set(false);
      },
    });
  }

  private aplicar(datos: MisHorarios): void {
    this.datos.set(datos);
    this.tarifa.set(String(datos.tarifaConsulta));
    this.cargando.set(false);
  }

  protected cuantas(horario: Horario): number {
    return Math.floor((minutos(horario.horaFin) - minutos(horario.horaInicio)) / horario.duracionMinutos);
  }

  protected agregar(): void {
    this.error.set(null);
    this.exito.set(null);
    if (minutos(this.fin()) <= minutos(this.inicio())) {
      this.error.set('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }
    this.guardando.set(true);
    this.casoUso
      .agregarHorario({
        diaSemana: this.dia(),
        horaInicio: this.inicio(),
        horaFin: this.fin(),
        duracionMinutos: this.duracion(),
      })
      .subscribe({
        next: (datos) => {
          this.aplicar(datos);
          this.guardando.set(false);
          this.exito.set('Horario agregado. Los tutores ya pueden pedir cita en esos espacios.');
        },
        error: (e: HttpErrorResponse) => {
          this.guardando.set(false);
          this.error.set(e.error?.mensaje ?? 'No se pudo agregar el horario');
        },
      });
  }

  protected quitar(horario: Horario): void {
    if (!confirm('¿Quitar este horario? Las citas que ya existan se mantienen.')) {
      return;
    }
    this.error.set(null);
    this.exito.set(null);
    this.casoUso.quitarHorario(horario.id).subscribe({
      next: (datos) => {
        this.aplicar(datos);
        this.exito.set('Horario quitado.');
      },
      error: (e: HttpErrorResponse) => this.error.set(e.error?.mensaje ?? 'No se pudo quitar el horario'),
    });
  }

  protected guardarTarifa(): void {
    this.error.set(null);
    this.exito.set(null);
    const valor = Number(this.tarifa().replace(',', '.'));
    if (!Number.isFinite(valor) || valor < 0 || valor > 9999.99) {
      this.error.set('Escribe una tarifa válida, entre 0 y 9999.99');
      return;
    }
    this.casoUso.guardarTarifa(valor).subscribe({
      next: (datos) => {
        this.aplicar(datos);
        this.exito.set('Tarifa guardada. Se aplicará a las citas nuevas.');
      },
      error: (e: HttpErrorResponse) => this.error.set(e.error?.mensaje ?? 'No se pudo guardar la tarifa'),
    });
  }
}