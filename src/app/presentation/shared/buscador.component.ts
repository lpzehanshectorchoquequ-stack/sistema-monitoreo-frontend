import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-buscador',
  template: `
    <div class="caja">
      <span class="lupa">🔍</span>
      <input
        type="search"
        [value]="valor()"
        [placeholder]="placeholder()"
        maxlength="100"
        (input)="valor.set($any($event.target).value)"
      />
      @if (valor()) {
        <button type="button" class="limpiar" (click)="valor.set('')" title="Borrar búsqueda">✕</button>
      }
    </div>
  `,
  styles: `
    .caja {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.3rem 1rem;
      margin-bottom: 1rem;
      background: #fff;
      border: 3px solid var(--c-claro);
      border-radius: 999px;
    }
    .caja:focus-within {
      border-color: var(--c-primario);
    }
    .lupa {
      font-size: 1.2rem;
    }
    input {
      flex: 1;
      padding: 0.7rem 0;
      font-family: inherit;
      font-size: 1.05rem;
      background: transparent;
      border: 0;
      outline: none;
    }
    .limpiar {
      padding: 0.3rem 0.6rem;
      color: var(--c-primario-osc);
      background: var(--c-claro);
      border: 0;
      border-radius: 50%;
      cursor: pointer;
    }
  `,
})
export class BuscadorComponent {
  readonly valor = model('');
  readonly placeholder = input('Buscar por nombre...');
}