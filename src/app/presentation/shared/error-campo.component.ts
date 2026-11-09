import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { mensajeError } from './validadores';

@Component({
  selector: 'app-error-campo',
  template: `
    @if (control().touched && control().invalid) {
      <small class="err">⚠️ {{ mensaje() }}</small>
    }
  `,
  styles: `
    .err {
      display: block;
      margin-top: 0.3rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: #c62828;
    }
  `,
})
export class ErrorCampoComponent {
  readonly control = input.required<AbstractControl>();

  protected mensaje(): string {
    return mensajeError(this.control().errors);
  }
}