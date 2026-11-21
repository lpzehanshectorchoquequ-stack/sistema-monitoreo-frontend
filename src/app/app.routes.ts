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
          import('./presentation/evaluaciones/evaluar.page').then((m) => m.EvaluarPage),
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
        path: 'evolucion/:id',
        loadComponent: () =>
          import('./presentation/estadisticas/evolucion.page').then((m) => m.EvolucionPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];