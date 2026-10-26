import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PacientePort } from './domain/paciente.port';
import { PacienteHttpAdapter } from './infrastructure/paciente-http.adapter';
import { EvaluacionPort } from './domain/evaluacion.port';
import { EvaluacionHttpAdapter } from './infrastructure/evaluacion-http.adapter';

import { routes } from './app.routes';
import { AuthPort } from './domain/auth.port';
import { AuthHttpAdapter } from './infrastructure/auth-http.adapter';
import { authInterceptor } from './infrastructure/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: AuthPort, useClass: AuthHttpAdapter },
    { provide: PacientePort, useClass: PacienteHttpAdapter },
    { provide: EvaluacionPort, useClass: EvaluacionHttpAdapter },
  ],
};