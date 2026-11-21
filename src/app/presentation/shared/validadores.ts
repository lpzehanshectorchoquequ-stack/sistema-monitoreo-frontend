import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { calcularEdad } from '../../domain/paciente.model';

export const EDAD_MINIMA = 6;
export const EDAD_MAXIMA = 12;

const NOMBRE = /^\p{L}+(?:[ '’-]\p{L}+)*$/u;
const TEXTO = /^[\p{L}\p{N} .,;:¡!¿?()\-_\/'"’%+\r\n]*$/u;
const CORREO = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const CONTRASENA = /^(?=.*\p{L})(?=.*\d)\S{8,64}$/u;

function texto(control: AbstractControl): string {
  return typeof control.value === 'string' ? control.value : '';
}

export function nombreValido(): ValidatorFn {
  return (control) => {
    const valor = texto(control);
    if (valor === '') {
      return null;
    }
    if (/\d/.test(valor)) {
      return { nombreConNumeros: true };
    }
    if (!NOMBRE.test(valor)) {
      return { nombreInvalido: true };
    }
    if (valor.replace(/[^\p{L}]/gu, '').length < 2) {
      return { nombreCorto: true };
    }
    return null;
  };
}

export function correoValido(): ValidatorFn {
  return (control) => {
    const valor = texto(control);
    return valor === '' || CORREO.test(valor) ? null : { correoInvalido: true };
  };
}

export function textoValido(): ValidatorFn {
  return (control) => (TEXTO.test(texto(control)) ? null : { textoInvalido: true });
}

export function contrasenaSegura(): ValidatorFn {
  return (control) => {
    const valor = texto(control);
    return valor === '' || CONTRASENA.test(valor) ? null : { contrasenaDebil: true };
  };
}

export function numeroValido(): ValidatorFn {
  return (control) => {
    const valor = texto(control);
    return valor === '' || /^\d+$/.test(valor) ? null : { numeroInvalido: true };
  };
}

export function fechaNacimientoValida(): ValidatorFn {
  return (control) => {
    const valor = texto(control);
    if (valor === '') {
      return null;
    }
    const fecha = new Date(valor + 'T00:00:00');
    if (Number.isNaN(fecha.getTime())) {
      return { fechaInvalida: true };
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha > hoy) {
      return { fechaFutura: true };
    }
    const edad = calcularEdad(valor);
    if (edad < EDAD_MINIMA || edad > EDAD_MAXIMA) {
      return { fechaFueraDeRango: true };
    }
    return null;
  };
}

export function mensajeError(errores: ValidationErrors | null): string {
  if (!errores) {
    return '';
  }
  if (errores['required']) return 'Este campo es obligatorio';
  if (errores['nombreConNumeros']) return 'El nombre no puede contener números';
  if (errores['nombreInvalido']) return 'Solo se permiten letras, espacios, apóstrofes y guiones';
  if (errores['nombreCorto']) return 'Debe tener al menos 2 letras';
  if (errores['correoInvalido']) return 'Ingresa un correo válido, por ejemplo nombre@ejemplo.com';
  if (errores['textoInvalido']) {
    return 'Hay caracteres no permitidos. Usa letras, números y signos básicos (. , ; : ! ? ( ) - _ / %)';
  }
  if (errores['contrasenaDebil']) return 'Mínimo 8 caracteres, con al menos una letra y un número, sin espacios';
  if (errores['numeroInvalido']) return 'Solo se permiten números';
  if (errores['fechaInvalida']) return 'La fecha no es válida';
  if (errores['fechaFutura']) return 'La fecha no puede ser futura';
  if (errores['fechaFueraDeRango']) return `La edad debe estar entre ${EDAD_MINIMA} y ${EDAD_MAXIMA} años`;
  if (errores['maxlength']) return `Máximo ${errores['maxlength'].requiredLength} caracteres`;
  if (errores['min']) return 'Selecciona una opción';
  return 'El valor ingresado no es válido';
}

export function coincidenContrasenas(campo: string, confirmacion: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campo)?.value;
    const b = grupo.get(confirmacion)?.value;
    return a === b ? null : { noCoinciden: true };
  };
}

function aTexto(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function rangoFechaNacimiento(): { min: string; max: string } {
  const hoy = new Date();
  const max = new Date(hoy.getFullYear() - EDAD_MINIMA, hoy.getMonth(), hoy.getDate());
  const min = new Date(hoy.getFullYear() - EDAD_MAXIMA - 1, hoy.getMonth(), hoy.getDate() + 1);
  return { min: aTexto(min), max: aTexto(max) };
}