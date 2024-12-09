import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authGuard } from './Auth/guards/auth.guard';
import { authLoggedGuard } from './Auth/guards/auth-logged.guard';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Auth/services/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    {
      provide: 'authGuard',
      useValue: authGuard
    },
    {
      provide: 'authLoggedGuard',
      useValue: authLoggedGuard
    },
    provideAnimationsAsync(),
  ]
};
