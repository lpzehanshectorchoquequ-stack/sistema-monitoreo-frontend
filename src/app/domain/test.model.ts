export interface TestResumen {
  id: number;
  nombre: string;
  trastorno: string;
  quienResponde: string;
  estadoValidacion: string;
  totalPreguntas: number;
  usado: boolean;
}

export interface PreguntaTest {
  id: number;
  orden: number;
  texto: string;
  subescala: string;
}

export interface CondicionTest {
  hecho: string;
  operador: string;
  valor: number;
}

export interface ReglaTest {
  codigo: string;
  descripcion: string;
  nivel: string | null;
  hechoDerivado: string | null;
  condiciones: CondicionTest[];
}

export interface TestDetalle {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  trastorno: string;
  quienResponde: string;
  estadoValidacion: string;
  usado: boolean;
  umbralesEditables: boolean;
  umbralModerado: number | null;
  umbralAlto: number | null;
  advertencia: string | null;
  preguntas: PreguntaTest[];
  reglas: ReglaTest[];
}

export interface TestDatos {
  nombre: string;
  descripcion: string;
  trastorno: string;
  quienResponde: string;
  estadoValidacion: string;
}

export interface PreguntaDatos {
  texto: string;
  subescala: string;
}

export const AREAS_TEST = [
  { valor: 'TDAH', nombre: 'TDAH', detalle: 'Atención y energía', icono: '⚡' },
  { valor: 'TEA', nombre: 'TEA', detalle: 'Comunicación y conducta', icono: '🧩' },
  { valor: 'APRENDIZAJE', nombre: 'Aprendizaje', detalle: 'Lectura, escritura y matemáticas', icono: '📚' },
  { valor: 'OTRA', nombre: 'Otra área', detalle: 'Evaluación general', icono: '🧠' },
];

export const RESPONDEN = [
  { valor: 'Tutor', nombre: 'El tutor', icono: '👨‍👩‍👧' },
  { valor: 'Docente', nombre: 'El docente', icono: '🧑‍🏫' },
  { valor: 'Psicologo', nombre: 'La psicóloga', icono: '👩‍⚕️' },
];