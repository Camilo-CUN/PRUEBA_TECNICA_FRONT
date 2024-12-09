import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { AdminUsers } from '../interfaces/Admin-users.interface';
import { Observable } from 'rxjs';
import AdminUsersPageComponent from '../pages/admin-users-page/admin-users-page.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

constructor() { }
private http = inject(HttpClient)
private loadingSignal = signal<boolean>(false);
public loading = computed(() => this.loadingSignal())
private apiurl: string = environment.apiUrl;


getAllUsers(): Observable<AdminUsers[]>{
  return this.http.get<AdminUsers[]>(`${this.apiurl}/User/GetAllUsers`);
}

deleteUserByEmail(email: string): Observable<void> {
  const url = `${this.apiurl}/User/DeleteUserByEmail/${email}`;
  return this.http.delete<void>(url);
}

updateUser(user: AdminUsers): Observable<AdminUsers> {
  const url = `${this.apiurl}/User/UpdateUser/${user.id}`;
  return this.http.put<AdminUsers>(url, user);
}

createUser(user: AdminUsers): Observable<AdminUsers> {
  const url = `${this.apiurl}/User/CreateUser`;
  return this.http.post<AdminUsers>(url, user);
}


onLoading(value: boolean){
  this.loadingSignal.set(value)
}

}
