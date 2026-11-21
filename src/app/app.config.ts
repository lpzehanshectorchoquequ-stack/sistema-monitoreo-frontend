import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthPort } from './domain/auth.port';
import { EstadisticaPort } from './domain/estadistica.port';
import { EvaluacionPort } from './domain/evaluacion.port';
import { PacientePort } from './domain/paciente.port';
import { UsuarioPort } from './domain/usuario.port';
import { AuthHttpAdapter } from './infrastructure/auth-http.adapter';
import { authInterceptor } from './infrastructure/auth.interceptor';
import { EstadisticaHttpAdapter } from './infrastructure/estadistica-http.adapter';
import { EvaluacionHttpAdapter } from './infrastructure/evaluacion-http.adapter';
import { PacienteHttpAdapter } from './infrastructure/paciente-http.adapter';
import { UsuarioHttpAdapter } from './infrastructure/usuario-http.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: AuthPort, useClass: AuthHttpAdapter },
    { provide: PacientePort, useClass: PacienteHttpAdapter },
    { provide: EvaluacionPort, useClass: EvaluacionHttpAdapter },
    { provide: UsuarioPort, useClass: UsuarioHttpAdapter },
    { provide: EstadisticaPort, useClass: EstadisticaHttpAdapter },
  ],
};