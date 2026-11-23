import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { GestionarRespaldosUseCase } from '../../application/gestionar-respaldos.use-case';
import { Respaldo } from '../../domain/respaldo.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';

@Component({
  selector: 'app-respaldos',
  imports: [BotonAtrasComponent],
  templateUrl: './respaldos.page.html',
  styleUrl: './respaldos.page.scss',
})
export class RespaldosPage implements OnInit {
  private readonly casoUso = inject(GestionarRespaldosUseCase);

  protected readonly respaldos = signal<Respaldo[]>([]);
  protected readonly cargando = signal(true);
  protected readonly creando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);

  // Estadísticas: se recalculan solas cada vez que cambia la lista
  protected readonly total = computed(() => this.respaldos().length);
  protected readonly manuales = computed(() => this.respaldos().filter((r) => r.tipo === 'manual').length);
  protected readonly automaticos = computed(() => this.respaldos().filter((r) => r.tipo === 'auto').length);
  protected readonly espacioTotal = computed(() =>
    this.respaldos().reduce((suma, r) => suma + (r.tamanoBytes ?? 0), 0),
  );
  protected readonly ultimo = computed<Respaldo | null>(() => {
    const lista = this.respaldos();
    if (lista.length === 0) {
      return null;
    }
    return lista.reduce((masReciente, r) =>
      new Date(r.fecha).getTime() > new Date(masReciente.fecha).getTime() ? r : masReciente,
    );
  });

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.casoUso.listar().subscribe({
      next: (lista) => {
        this.respaldos.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de respaldos');
        this.cargando.set(false);
      },
    });
  }

  protected crear(): void {
    this.creando.set(true);
    this.error.set(null);
    this.exito.set(null);
    this.casoUso.crear().subscribe({
      next: (respaldo) => {
        this.creando.set(false);
        this.exito.set(`Respaldo creado: ${respaldo.nombre}`);
        this.cargar();
      },
      error: (e: HttpErrorResponse) => {
        this.creando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudo crear el respaldo');
      },
    });
  }

  protected descargar(respaldo: Respaldo): void {
    this.error.set(null);
    this.casoUso.descargar(respaldo.nombre).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = respaldo.nombre;
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.error.set('No se pudo descargar el respaldo'),
    });
  }

  protected eliminar(respaldo: Respaldo): void {
    if (!confirm('¿Eliminar este respaldo? Esta acción no se puede deshacer.')) {
      return;
    }
    this.error.set(null);
    this.exito.set(null);
    this.casoUso.eliminar(respaldo.nombre).subscribe({
      next: () => {
        this.exito.set('Respaldo eliminado.');
        this.cargar();
      },
      error: (e: HttpErrorResponse) => this.error.set(e.error?.mensaje ?? 'No se pudo eliminar el respaldo'),
    });
  }

  protected tamano(bytes: number | null | undefined): string {
    const valor = bytes ?? 0;
    if (valor < 1024) {
      return `${valor} B`;
    }
    const kb = valor / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    const mb = kb / 1024;
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`;
    }
    return `${(mb / 1024).toFixed(2)} GB`;
  }

  protected fecha(valor: string): string {
    const d = new Date(valor);
    if (isNaN(d.getTime())) {
      return valor;
    }
    return d.toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}