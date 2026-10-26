export interface Paciente {
  id: number;
  nombre: string;
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
  fechaNacimiento: string;
  motivoConsulta: string;
  tutorId: number;
  genero: string;
  fortalezas: string;
  dificultades: string;
}

export interface HijoDatos {
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  motivoConsulta: string;
  psicologoId: number;
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