import { Routes } from '@angular/router';
import { authGuard, sesionGuard } from './presentation/guards/auth.guard';
import { rolGuard } from './presentation/guards/role.guard';
import { ShellComponent } from './presentation/shared/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./presentation/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cambiar-contrasena',
    canActivate: [sesionGuard],
    loadComponent: () =>
      import('./presentation/cuenta/cambiar-contrasena.page').then((m) => m.CambiarContrasenaPage),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/inicio/inicio.page').then((m) => m.InicioPage),
      },
      {
        path: 'usuarios',
        canActivate: [rolGuard(['Admin', 'Psicologo'])],
        loadComponent: () =>
          import('./presentation/usuarios/usuarios.page').then((m) => m.UsuariosPage),
      },
      {
        path: 'pacientes',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/pacientes/pacientes-lista.page').then((m) => m.PacientesListaPage),
      },
      {
        path: 'pacientes/nuevo',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/pacientes/paciente-form.page').then((m) => m.PacienteFormPage),
      },
      {
        path: 'pacientes/:id/editar',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/pacientes/paciente-form.page').then((m) => m.PacienteFormPage),
      },
      {
        path: 'pacientes/:id/historial',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/evaluaciones/historial.page').then((m) => m.HistorialPage),
      },
      {
        path: 'evaluaciones',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/evaluaciones/evaluaciones.page').then((m) => m.EvaluacionesPage),
      },
      {
        path: 'evaluaciones/nueva',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/evaluaciones/evaluar.page').then((m) => m.EvaluarPage),
      },
      {
        path: 'evaluaciones/:id',
        loadComponent: () =>
          import('./presentation/evaluaciones/detalle-evaluacion.page').then((m) => m.DetalleEvaluacionPage),
      },
      {
        path: 'evaluaciones/:id/responder',
        canActivate: [rolGuard(['Tutor', 'Psicologo'])],
        loadComponent: () =>
          import('./presentation/evaluaciones/responder-evaluacion.page').then((m) => m.ResponderEvaluacionPage),
      },
      {
        path: 'mis-evaluaciones',
        canActivate: [rolGuard(['Tutor'])],
        loadComponent: () =>
          import('./presentation/evaluaciones/evaluaciones.page').then((m) => m.EvaluacionesPage),
      },
      {
        path: 'mis-hijos',
        canActivate: [rolGuard(['Tutor'])],
        loadComponent: () =>
          import('./presentation/tutor/mis-hijos.page').then((m) => m.MisHijosPage),
      },
      {
        path: 'mis-hijos/registrar',
        canActivate: [rolGuard(['Tutor'])],
        loadComponent: () =>
          import('./presentation/tutor/registrar-hijo.page').then((m) => m.RegistrarHijoPage),
      },
      {
        path: 'estadisticas',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/estadisticas/panel.page').then((m) => m.PanelEstadisticasPage),
      },
      {
        path: 'estadisticas/citas',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/estadisticas/panel-citas.page').then((m) => m.PanelCitasPage),
      },
      {
        path: 'evolucion/:id',
        loadComponent: () =>
          import('./presentation/estadisticas/evolucion.page').then((m) => m.EvolucionPage),
      },
      {
        path: 'tests',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/tests/tests-lista.page').then((m) => m.TestsListaPage),
      },
      {
        path: 'tests/nuevo',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/tests/test-editor.page').then((m) => m.TestEditorPage),
      },
      {
        path: 'tests/:id',
        canActivate: [rolGuard(['Psicologo', 'Admin'])],
        loadComponent: () =>
          import('./presentation/tests/test-editor.page').then((m) => m.TestEditorPage),
      },
      {
        path: 'horarios',
        canActivate: [rolGuard(['Psicologo'])],
        loadComponent: () =>
          import('./presentation/citas/horarios.page').then((m) => m.HorariosPage),
      },
      {
        path: 'citas',
        loadComponent: () =>
          import('./presentation/citas/citas.page').then((m) => m.CitasPage),
      },
      {
        path: 'citas/nueva',
        canActivate: [rolGuard(['Tutor', 'Psicologo'])],
        loadComponent: () =>
          import('./presentation/citas/nueva-cita.page').then((m) => m.NuevaCitaPage),
      },
      {
        path: 'bitacora',
        canActivate: [rolGuard(['Admin'])],
        loadComponent: () =>
          import('./presentation/sistema/bitacora.page').then((m) => m.BitacoraPage),
      },
      {
        path: 'respaldos',
        canActivate: [rolGuard(['Admin'])],
        loadComponent: () =>
          import('./presentation/sistema/respaldos.page').then((m) => m.RespaldosPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];