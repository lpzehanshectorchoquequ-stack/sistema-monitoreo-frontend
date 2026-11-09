import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { calcularEdad } from '../../domain/paciente.model';

export const EDAD_MAXIMA = 18;

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
    if (calcularEdad(valor) > EDAD_MAXIMA) {
      return { fechaMuyAntigua: true };
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
  if (errores['fechaMuyAntigua']) return `La edad máxima permitida es ${EDAD_MAXIMA} años`;
  if (errores['maxlength']) return `Máximo ${errores['maxlength'].requiredLength} caracteres`;
  if (errores['min']) return 'Selecciona una opción';
  return 'El valor ingresado no es válido';
}