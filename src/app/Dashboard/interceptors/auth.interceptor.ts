import { HttpInterceptorFn, HttpRequest, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environments';

const env = environment;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if(env.apiUrl && !req.url.includes('Auth')){
      return GetAuthToken().pipe(
        switchMap((token) => {
          const authReq = req.clone({
            headers: req.headers
              .set('Authorization', "bearer " + token)
              .set('Content-Type', 'application/json'),
          });
          return next(authReq);
    }));
  }
  return next(req);
}

const GetAuthToken = ():Observable<string> => {
  const http = inject(HttpClient);

  const credentials = {
    username: env.apiUser,
    password: env.apiPassword,
  };
  console.log({credentials})
  return http.post<string>(`${env.apiUrl}/Auth`, credentials)
  .pipe(
    tap(console.log),
    map((response:any) => response.token)
  );
}
