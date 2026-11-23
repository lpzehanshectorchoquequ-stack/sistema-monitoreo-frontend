export interface Respaldo {
  nombre: string;
  tipo: 'manual' | 'auto';
  tamanoBytes: number;
  fecha: string;
}