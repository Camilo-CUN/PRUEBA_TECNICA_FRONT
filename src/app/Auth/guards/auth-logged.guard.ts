import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guard para validar que si el usuario está logged no lo deje ir a la página de inicio
 * @param route
 * @param state
 * @returns can active or not active
 */
export const authLoggedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authUserLogged().pipe(
    map((validarToken) => {
      if (validarToken) {
        router.navigate(['/admin']);
      }

      return validarToken;
    }),
    switchMap((canActiveIndex) => of(canActiveIndex))
  );
};
