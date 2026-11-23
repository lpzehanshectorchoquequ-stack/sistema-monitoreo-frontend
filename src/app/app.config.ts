import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthPort } from './domain/auth.port';
import { BitacoraPort } from './domain/bitacora.port';
import { CitaPort } from './domain/cita.port';
import { EstadisticaPort } from './domain/estadistica.port';
import { EvaluacionPort } from './domain/evaluacion.port';
import { FlujoEvaluacionPort } from './domain/flujo-evaluacion.port';
import { PacientePort } from './domain/paciente.port';
import { TestPort } from './domain/test.port';
import { UsuarioPort } from './domain/usuario.port';
import { AuthHttpAdapter } from './infrastructure/auth-http.adapter';
import { authInterceptor } from './infrastructure/auth.interceptor';
import { BitacoraHttpAdapter } from './infrastructure/bitacora-http.adapter';
import { CitaHttpAdapter } from './infrastructure/cita-http.adapter';
import { EstadisticaHttpAdapter } from './infrastructure/estadistica-http.adapter';
import { EvaluacionHttpAdapter } from './infrastructure/evaluacion-http.adapter';
import { FlujoEvaluacionHttpAdapter } from './infrastructure/flujo-evaluacion-http.adapter';
import { PacienteHttpAdapter } from './infrastructure/paciente-http.adapter';
import { TestHttpAdapter } from './infrastructure/test-http.adapter';
import { UsuarioHttpAdapter } from './infrastructure/usuario-http.adapter';
import { RespaldoPort } from './domain/respaldo.port';
import { RespaldoHttpAdapter } from './infrastructure/respaldo-http.adapter';

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
    { provide: TestPort, useClass: TestHttpAdapter },
    { provide: FlujoEvaluacionPort, useClass: FlujoEvaluacionHttpAdapter },
    { provide: CitaPort, useClass: CitaHttpAdapter },
    { provide: BitacoraPort, useClass: BitacoraHttpAdapter },
    { provide: RespaldoPort, useClass: RespaldoHttpAdapter },
  ],
};