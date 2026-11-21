import { Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boton-atras',
  template: `<button type="button" class="atras" (click)="volver()">← {{ texto() }}</button>`,
  styles: `
    .atras {
      padding: 0.6rem 1.3rem;
      margin-bottom: 1rem;
      font-family: inherit;
      font-size: 1rem;
      font-weight: 800;
      color: var(--c-primario-osc);
      background: var(--c-claro);
      border: 0;
      border-radius: 999px;
      cursor: pointer;
      transition: transform 0.15s;
    }
    .atras:hover {
      transform: translateX(-3px);
    }
  `,
})
export class BotonAtrasComponent {
  readonly texto = input('Atrás');
  readonly destino = input('/');

  private readonly ubicacion = inject(Location);
  private readonly router = inject(Router);

  protected volver(): void {
    if (window.history.length > 1) {
      this.ubicacion.back();
    } else {
      this.router.navigateByUrl(this.destino());
    }
  }
}