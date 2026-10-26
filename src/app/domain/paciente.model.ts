export interface Paciente {
  id: number;
  nombre: string;
  fechaNacimiento: string; // formato AAAA-MM-DD
  motivoConsulta: string | null;
  tutorId: number | null;
  tutorNombre: string | null;
}

export interface PacienteDatos {
  nombre: string;
  fechaNacimiento: string;
  motivoConsulta: string;
  tutorId: number;
}

export interface Tutor {
  id: number;
  nombre: string;
  correo: string;
}

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