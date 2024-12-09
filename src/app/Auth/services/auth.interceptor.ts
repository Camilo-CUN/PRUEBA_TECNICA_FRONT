import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable, Pipe } from '@angular/core';
import { environment } from '../../../environments/environments';
import { map, Observable, switchMap } from 'rxjs';
import { User, LoginOrganigramaRes } from '../interfaces/login.interface';

const env = environment;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor activado:', req.url);
  if (env.apiUrl && (req.url.includes('Product') || req.url.includes('User')) && !req.url.includes('login')) {
    console.log('Intercepting URL:', req.url);
    return GetSessionToken().pipe(
      switchMap((token) => {
        const authReq = req.clone({
          headers: req.headers
            .set('Authorization', `Bearer ${token}`) // Token obtenido de sessionStorage
            .set('Content-Type', 'application/json'),
        });
        return next(authReq);
      })
    );
  }
  return next(req);
};


const GetSessionToken = (): Observable<string> =>{
  const userString = sessionStorage.getItem('user');

  return new Observable<string>((observer) =>{
    if(userString){
      const user = JSON.parse(userString);
      if(user.token){
        observer.next(user.token);
        observer.complete();
      }else {
        observer.error('No se encontró el token en el objeto User');
      }
    }else{
      observer.error('No se encontró el token')
    }
  })
}


