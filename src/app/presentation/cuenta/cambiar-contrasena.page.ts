import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CambiarContrasenaUseCase } from '../../application/cambiar-contrasena.use-case';
import { SessionStore } from '../../application/session.store';
import { ErrorCampoComponent } from '../shared/error-campo.component';
import { FondoComponent } from '../shared/fondo.component';
import { coincidenContrasenas, contrasenaSegura } from '../shared/validadores';

@Component({
  selector: 'app-cambiar-contrasena',
  imports: [ReactiveFormsModule, ErrorCampoComponent, FondoComponent],
  templateUrl: './cambiar-contrasena.page.html',
  styleUrl: './cambiar-contrasena.page.scss',
})
export class CambiarContrasenaPage {
  private readonly fb = inject(FormBuilder);
  private readonly casoUso = inject(CambiarContrasenaUseCase);
  private readonly router = inject(Router);

  protected readonly sesion = inject(SessionStore).sesion;
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrar = signal(false);

  protected readonly form = this.fb.nonNullable.group(
    {
      actual: ['', [Validators.required, Validators.maxLength(100)]],
      nueva: ['', [Validators.required, contrasenaSegura()]],
      confirmar: ['', [Validators.required]],
    },
    { validators: coincidenContrasenas('nueva', 'confirmar') },
  );

  protected longitudOk(): boolean {
    const largo = this.form.controls.nueva.value.length;
    return largo >= 8 && largo <= 64;
  }

  protected letraOk(): boolean {
    return /\p{L}/u.test(this.form.controls.nueva.value);
  }

  protected numeroOk(): boolean {
    return /\d/.test(this.form.controls.nueva.value);
  }

  protected sinEspaciosOk(): boolean {
    const valor = this.form.controls.nueva.value;
    return valor.length > 0 && !/\s/.test(valor);
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { actual, nueva } = this.form.getRawValue();
    this.guardando.set(true);
    this.error.set(null);

    this.casoUso.ejecutar(actual, nueva).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudo cambiar la contraseña');
      },
    });
  }
}