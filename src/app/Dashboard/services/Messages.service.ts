import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { delay, map, Observable, tap } from 'rxjs';
import { Message, ResHistoryMessages } from '../interfaces/Message.interface';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
private http = inject(HttpClient)
private mensajesSignal = signal<Message[] | undefined>(undefined);
private loadingSignal = signal<boolean>(false);
public mensajes = computed(() => this.mensajesSignal())
public loading = computed(() => this.loadingSignal())
private apiurl: string = environment.apiUrl;
constructor() { }


GetAllHistoryMessages(pageNumber: number, pageSize : number): Observable<ResHistoryMessages>{
  return this.http.get<ResHistoryMessages>(`${this.apiurl}/Mensajeria/ViewHistory?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  .pipe(
    map((response) => response)
  );
}

GetFilteredMessages(beginDate: string, endDate: string ): Observable<Message[]>{
  return this.http.post<Message[]>(`${this.apiurl}/Mensajeria/ViewHistoryFilter`, {beginDate, endDate})
  .pipe(
    map((response) => {
      this.mensajesSignal.set(response)
      return response;
    }),

  );
}

  onLoading(value: boolean){
    this.loadingSignal.set(value)
  }
}
