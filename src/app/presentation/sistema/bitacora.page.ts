import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ConsultarBitacoraUseCase } from '../../application/consultar-bitacora.use-case';
import {
  FiltroBitacora,
  MODULOS_BITACORA,
  PaginaBitacora,
  ResumenBitacora,
} from '../../domain/bitacora.model';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { FiltroEntradaDirective } from '../shared/filtro-entrada.directive';

const ICONOS: Record<string, string> = {
  INICIO_SESION: '🔓',
  SESION_FALLIDA: '🚫',
  CREAR: '➕',
  MODIFICAR: '✏️',
  ELIMINAR: '🗑️',
};

@Component({
  selector: 'app-bitacora',
  imports: [BotonAtrasComponent, FiltroEntradaDirective],
  templateUrl: './bitacora.page.html',
  styleUrl: './bitacora.page.scss',
})
export class BitacoraPage implements OnInit {
  private readonly casoUso = inject(ConsultarBitacoraUseCase);

  protected readonly modulos = MODULOS_BITACORA;
  protected readonly tamanos = [10, 25, 50, 100];

  protected readonly resumen = signal<ResumenBitacora | null>(null);
  protected readonly pagina = signal<PaginaBitacora | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly texto = signal('');
  protected readonly modulo = signal('');
  protected readonly resultado = signal('');
  protected readonly desde = signal('');
  protected readonly hasta = signal('');
  protected readonly indice = signal(0);
  protected readonly tamano = signal(25);

  private temporizador: ReturnType<typeof setTimeout> | undefined;

  protected readonly filtro = computed<FiltroBitacora>(() => ({
    texto: this.texto(),
    modulo: this.modulo(),
    resultado: this.resultado(),
    desde: this.desde(),
    hasta: this.hasta(),
  }));

  protected readonly hayFiltros = computed(
    () => !!(this.texto() || this.modulo() || this.resultado() || this.desde() || this.hasta()),
  );

  ngOnInit(): void {
    this.cargarResumen();
    this.buscar();
  }

  private cargarResumen(): void {
    this.casoUso.resumen().subscribe({ next: (r) => this.resumen.set(r), error: () => undefined });
  }

  protected buscar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.casoUso.buscar(this.filtro(), this.indice(), this.tamano()).subscribe({
      next: (datos) => {
        this.pagina.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la bitácora');
        this.cargando.set(false);
      },
    });
  }

  protected alEscribir(valor: string): void {
    this.texto.set(valor);
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.filtrar(), 350);
  }

  protected filtrar(): void {
    this.indice.set(0);
    this.buscar();
  }

  protected cambiarTamano(valor: number): void {
    this.tamano.set(valor);
    this.filtrar();
  }

  protected irA(indice: number): void {
    const total = this.pagina()?.totalPaginas ?? 1;
    if (indice < 0 || indice >= total) {
      return;
    }
    this.indice.set(indice);
    this.buscar();
  }

  protected limpiar(): void {
    this.texto.set('');
    this.modulo.set('');
    this.resultado.set('');
    this.desde.set('');
    this.hasta.set('');
    this.filtrar();
  }

  protected actualizar(): void {
    this.cargarResumen();
    this.buscar();
  }

  protected icono(accion: string): string {
    return ICONOS[accion] ?? '⚙️';
  }

  protected fecha(iso: string): string {
    return `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)} ${iso.slice(11, 19)}`;
  }

  protected nombreUsuario(usuario: string): string {
    return usuario === 'anonimo' ? 'Anónimo' : usuario === 'sistema' ? 'Sistema' : usuario;
  }

  protected exportarCsv(): void {
    this.casoUso.buscar(this.filtro(), 0, 500).subscribe({
      next: (datos) => {
        const filas: string[][] = [
          ['Fecha', 'Usuario', 'Rol', 'Módulo', 'Acción', 'Resultado', 'IP'],
          ...datos.items.map((r) => [
            this.fecha(r.fechaHora),
            this.nombreUsuario(r.usuario),
            r.rol ?? '',
            r.modulo,
            r.descripcion,
            r.resultado === 'EXITO' ? 'Exitoso' : 'Con error',
            r.ip ?? '',
          ]),
        ];
        const texto = filas
          .map((fila) => fila.map((celda) => '"' + String(celda).replace(/"/g, '""') + '"').join(','))
          .join('\r\n');
        const blob = new Blob(['\uFEFF' + texto], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'bitacora-pequementes.csv';
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.error.set('No se pudo exportar la bitácora'),
    });
  }
}