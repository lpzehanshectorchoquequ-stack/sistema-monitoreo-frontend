import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../../application/session.store';

export const authGuard: CanActivateFn = () => {
  const store = inject(SessionStore);
  const router = inject(Router);

  if (!store.autenticado()) {
    return router.createUrlTree(['/login']);
  }
  if (store.sesion()?.debeCambiarContrasena) {
    return router.createUrlTree(['/cambiar-contrasena']);
  }
  return true;
};

// Solo exige tener sesión (la usa la pantalla de cambiar contraseña)
export const sesionGuard: CanActivateFn = () => {
  const store = inject(SessionStore);
  const router = inject(Router);
  return store.autenticado() ? true : router.createUrlTree(['/login']);
};