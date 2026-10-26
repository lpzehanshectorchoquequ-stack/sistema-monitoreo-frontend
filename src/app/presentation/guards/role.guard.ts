import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../../application/session.store';

export const rolGuard = (permitidos: string[]): CanActivateFn => () => {
  const store = inject(SessionStore);
  const router = inject(Router);
  const rol = store.sesion()?.rol;
  return rol && permitidos.includes(rol) ? true : router.createUrlTree(['/']);
};