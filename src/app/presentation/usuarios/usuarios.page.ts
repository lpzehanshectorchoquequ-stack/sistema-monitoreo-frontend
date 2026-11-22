import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GestionarUsuariosUseCase } from '../../application/gestionar-usuarios.use-case';
import { SessionStore } from '../../application/session.store';
import { Usuario, UsuarioCreado } from '../../domain/usuario.model';
import { ErrorCampoComponent } from '../shared/error-campo.component';
import { FiltroEntradaDirective } from '../shared/filtro-entrada.directive';
import { correoValido, nombreValido } from '../shared/validadores';
import { BotonAtrasComponent } from '../shared/boton-atras.component';
import { BuscadorComponent } from '../shared/buscador.component';
import { normalizar } from '../shared/texto';

interface Credencial {
  titulo: string;
  nombre: string;
  correo: string;
  contrasena: string;
}

const NOMBRES_ROL: Record<string, string> = {
  Admin: 'Administrador',
  Psicologo: 'Psicóloga',
  Tutor: 'Tutor',
};

const AVATARES: Record<string, string> = { Admin: '🛡️', Psicologo: '👩‍⚕️', Tutor: '👨‍👩‍👧' };

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, ErrorCampoComponent, FiltroEntradaDirective, BotonAtrasComponent, BuscadorComponent],
  templateUrl: './usuarios.page.html',
  styleUrl: './usuarios.page.scss',
})
export class UsuariosPage implements OnInit {
  private readonly casoUso = inject(GestionarUsuariosUseCase);
  private readonly fb = inject(FormBuilder);

  protected readonly sesion = inject(SessionStore).sesion;
  protected readonly esAdmin = computed(() => this.sesion()?.rol === 'Admin');
  protected readonly rolesPermitidos = computed(() => (this.esAdmin() ? ['Psicologo', 'Admin'] : ['Tutor']));

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrandoForm = signal(false);
  protected readonly guardando = signal(false);
  protected readonly credencial = signal<Credencial | null>(null);
  protected readonly copiado = signal(false);

  protected readonly filtro = signal('');

  protected readonly visibles = computed(() => {
    const consulta = normalizar(this.filtro());
    if (!consulta) {
      return this.usuarios();
    }
    return this.usuarios().filter(
      (u) => normalizar(u.nombre).includes(consulta) || normalizar(u.correo).includes(consulta),
    );
  });

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, nombreValido(), Validators.maxLength(100)]],
    apellido: ['', [Validators.required, nombreValido(), Validators.maxLength(100)]],
    correo: ['', [Validators.required, correoValido(), Validators.maxLength(100)]],
    rol: ['', Validators.required],
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected nombreRol(rol: string): string {
    return NOMBRES_ROL[rol] ?? rol;
  }

  protected avatar(rol: string): string {
    return AVATARES[rol] ?? '👤';
  }

  protected esMiCuenta(usuario: Usuario): boolean {
    return usuario.correo === this.sesion()?.correo;
  }

  private cargar(): void {
    this.cargando.set(true);
    this.casoUso.listar().subscribe({
      next: (lista) => {
        this.usuarios.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de cuentas');
        this.cargando.set(false);
      },
    });
  }

  protected abrirFormulario(): void {
    this.error.set(null);
    this.form.reset({ nombre: '', apellido: '', correo: '', rol: this.esAdmin() ? '' : 'Tutor' });
    this.mostrandoForm.set(true);
  }

  protected cancelar(): void {
    this.mostrandoForm.set(false);
  }

  protected crear(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set(null);

    this.casoUso.crear(this.form.getRawValue()).subscribe({
      next: (resultado) => {
        this.guardando.set(false);
        this.mostrandoForm.set(false);
        this.mostrarCredencial('¡Cuenta creada!', resultado);
        this.cargar();
      },
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(e.error?.mensaje ?? 'No se pudo crear la cuenta');
      },
    });
  }

  protected restablecer(usuario: Usuario): void {
    if (!confirm(`¿Restablecer la contraseña de ${usuario.nombre}? Se generará una contraseña temporal nueva.`)) {
      return;
    }
    this.error.set(null);
    this.casoUso.restablecerContrasena(usuario.id).subscribe({
      next: (resultado) => {
        this.mostrarCredencial('Contraseña restablecida', resultado);
        this.cargar();
      },
      error: (e: HttpErrorResponse) => this.error.set(e.error?.mensaje ?? 'No se pudo restablecer la contraseña'),
    });
  }

  protected alternarEstado(usuario: Usuario): void {
    const accion = usuario.activo ? 'desactivar' : 'activar';
    if (!confirm(`¿Quieres ${accion} la cuenta de ${usuario.nombre}?`)) {
      return;
    }
    this.error.set(null);
    this.casoUso.cambiarEstado(usuario.id, !usuario.activo).subscribe({
      next: () => this.cargar(),
      error: (e: HttpErrorResponse) => this.error.set(e.error?.mensaje ?? 'No se pudo cambiar el estado'),
    });
  }

  private mostrarCredencial(titulo: string, resultado: UsuarioCreado): void {
    this.copiado.set(false);
    this.credencial.set({
      titulo,
      nombre: resultado.usuario.nombre,
      correo: resultado.usuario.correo,
      contrasena: resultado.contrasenaTemporal,
    });
  }

  protected async copiar(credencial: Credencial): Promise<void> {
    const texto = `PequeMentes\nCorreo: ${credencial.correo}\nContraseña temporal: ${credencial.contrasena}`;
    try {
      await navigator.clipboard.writeText(texto);
      this.copiado.set(true);
    } catch {
      this.copiado.set(false);
    }
  }

  protected cerrarCredencial(): void {
    this.credencial.set(null);
  }
}