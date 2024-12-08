import { inject, Injectable } from '@angular/core';
import { Login, LoginResponse, User } from '../interfaces/login.interface';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
private http = inject(HttpClient)
private _user?: User;
private env = environment;
constructor() { }

  GetUserData(Login: Login){
    return this.http.post<LoginResponse>(`${this.env.apiUrl}/GestionUsuarios/login`, Login).pipe(
      tap((res) =>{
        const user: User = {
          user: res.user,
          rol: res.rol,
          estado: res.estado,
          token: res.token
        };
        sessionStorage.setItem('user', JSON.stringify(user));
        this._user = user;
      })
    );
  }

  logOut(): void{
    this._user = undefined;
    sessionStorage.removeItem('user');
  }


  getStorageUserData(): User | undefined{
    const user = sessionStorage.getItem('user');

    if(!user) return undefined;
    this._user = JSON.parse(user);

    return JSON.parse(user);
  }

  authUserLogged(): Observable<boolean>{
    if(this.getStorageUserData()){
      return of(true);
    }
    return of(false);
  }

}
