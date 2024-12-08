import { Component, inject, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../Shared/components/layout/layout.component';
import { TablaRegistrosComponent } from "../../components/tablaRegistros/tablaRegistros.component";
import {MatCardModule} from '@angular/material/card';
import { GraphicMessagesComponent } from '../../components/GraphicMessages/GraphicMessages.component';
import { SpinnerComponent } from '../../../Shared/components/spinner/spinner.component';
import { Message } from '../../interfaces/Message.interface';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MessagesService } from '../../services/Messages.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-HistoricoPage',
  templateUrl: './HistoricoPage.component.html',
  styleUrls: ['./HistoricoPage.component.css'],
  standalone: true,
  imports: [
    LayoutComponent,
    TablaRegistrosComponent,
    MatCardModule,
    GraphicMessagesComponent,
    SpinnerComponent,
    MatIcon,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    OverlayModule
  ],
})
export default class HistoricoPageComponent implements OnInit {
  public Graphic: boolean = false;
  public messageService = inject(MessagesService);
  public mensajesParaGraficar: Message[] = [];
  get loading() : boolean {
    return this.messageService.loading()
  }

  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  actualizarMensajes(mensajes: Message[]) {
    console.log('Mensajes recibidos desde la tabla:', mensajes);
    this.mensajesParaGraficar = mensajes;
  }
  constructor() {}

  CambiarGrafica(){
    this.Graphic = !this.Graphic;
    this.range.reset();
  }

  onDateSelected(event: any): void{
    this.messageService.onLoading(true);
    this.messageService.GetFilteredMessages(this.range.value.start!.toLocaleDateString('en-CA'), this.range.value.end!.toLocaleDateString('en-CA')).subscribe({
      next: (mensajes) => {
        this.messageService.onLoading(false);
        // this.mensajesParaGraficar = mensajes;
        this.Graphic = true;
        this.range.reset();
      },
      error: (error) => {
        this.messageService.onLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar los registros filtrados',
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true})
        this.mensajesParaGraficar = []
        this.range.reset();
      },
    })
  }

  ngOnInit() {}
}
