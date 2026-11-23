export interface Paciente {
  id: number;
  nombre: string; // nombre completo, para mostrar
  nombrePila: string;
  apellido: string;
  fechaNacimiento: string; // formato AAAA-MM-DD
  genero: string | null;
  motivoConsulta: string | null;
  fortalezas: string | null;
  dificultades: string | null;
  tutorId: number | null;
  tutorNombre: string | null;
  psicologoNombre: string | null;
}

export interface PacienteDatos {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  motivoConsulta: string;
  tutorId: number;
  genero: string;
  fortalezas: string;
  dificultades: string;
}

export interface HijoDatos {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: string;
  motivoConsulta: string;
}

export interface Tutor {
  id: number;
  nombre: string;
  correo: string;
}

export type Psicologo = Tutor;

export function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento + 'T00:00:00');
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) {
    edad--;
  }
  return edad;
}

export interface TutorVinculado {
  tutorId: number;
  nombre: string;
  correo: string;
  parentesco: string;
  principal: boolean;
}

export const PARENTESCOS = ['Madre', 'Padre', 'Abuelo/a', 'Tío/a', 'Hermano/a mayor', 'Otro'];