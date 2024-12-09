import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap, map } from 'rxjs';

//Guard para proteger las rutas
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authUserLogged().pipe(
    map((validarToken) => {
      if (!validarToken) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
