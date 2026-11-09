import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

export type TipoFiltro = 'nombre' | 'texto' | 'correo' | 'numero';

const PROHIBIDOS: Record<TipoFiltro, RegExp> = {
  nombre: /[^\p{L} '’-]/gu,
  texto: /[^\p{L}\p{N} .,;:¡!¿?()\-_\/'"’%+\r\n]/gu,
  correo: /[^A-Za-z0-9._%+@-]/g,
  numero: /\D/g,
};

@Directive({ selector: '[appFiltro]' })
export class FiltroEntradaDirective {
  readonly appFiltro = input.required<TipoFiltro>();
  private readonly el = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);

  @HostListener('input')
  alEscribir(): void {
    const elemento = this.el.nativeElement;
    let valor = elemento.value.replace(PROHIBIDOS[this.appFiltro()], '');
    if (this.appFiltro() === 'nombre') {
      valor = valor.replace(/^\s+/, '').replace(/ {2,}/g, ' ');
    }
    if (valor !== elemento.value) {
      elemento.value = valor;
      // Avisa a Angular del valor ya limpio
      elemento.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}