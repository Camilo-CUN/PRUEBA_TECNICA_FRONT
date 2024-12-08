import {AfterViewInit, Component, ViewChild, OnInit, inject, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MessagesService } from '../../services/Messages.service';
import Swal from 'sweetalert2';
import { Message } from '../../interfaces/Message.interface';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import * as XSLX from 'xlsx';
import jsPDF from 'jspdf';
import { SpinnerComponent } from '../../../Shared/components/spinner/spinner.component';
import { CommonModule } from '@angular/common';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

@Component({
  selector: 'app-tablaRegistros',
  templateUrl: './tablaRegistros.component.html',
  styleUrls: ['./tablaRegistros.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatTooltipModule, MatIconModule, SpinnerComponent, CommonModule]
})

export class TablaRegistrosComponent implements OnInit {
  private MessageService = inject(MessagesService)
  public table: boolean = false;
  public totalMessages: number= 0;
  public currentPage: number = 1;
  displayedColumns: string[] = ['id', 'fechaEntrada', 'campaña', 'numero', 'mensaje'];
  dataSource = new MatTableDataSource<Message>();

  // @ViewChild(MatPaginator) paginator?: MatPaginator;
  // @ViewChild(MatSort) sort?: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.cargarHistoricoMensajes(1, 1000);
  }

  constructor(private cdr: ChangeDetectorRef) {
  }


  ngAfterViewChecked(): void {
    if (!this.dataSource.sort && this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (!this.dataSource.paginator && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cargarHistoricoMensajes(pageNumber: number = 1, pageSize: number = 1000) {
    this.MessageService.onLoading(true);

    this.MessageService.GetAllHistoryMessages(pageNumber, pageSize).subscribe({
      next: (res) => {
        this.dataSource.data = [...this.dataSource.data, ...res.data];
        this.totalMessages = res.totalMessages || 20000;
        // Asignamos `paginator` solo después de asegurarnos de que los datos estén completos
        setTimeout(() => {
          if (this.paginator) {
            // this.paginator.length = this.totalMessages;
            // this.paginator.pageSize = pageSize;
            // this.dataSource.paginator!.length = this.totalMessages;
            this.cdr.detectChanges(); // Forzamos un ciclo de cambio para asegurar la actualización
          }
        }, 0);

        this.table = true;
        this.MessageService.onLoading(false);

        // Confirmación en consola para verificar el total de registros y el tamaño de la página
        console.log('Paginator length (final):', this.paginator?.length);
        console.log('Paginator pageSize (final):', this.paginator?.pageSize);
      },
      error: (err) => {
        this.MessageService.onLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar los registros',
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true,
        });
      }
    });
  }

  cargarMasDatos() {
    this.currentPage++;  // Incrementamos la página
    this.cargarHistoricoMensajes(this.currentPage, 1000);  // Llamamos con la nueva página
  }



  exportExcel(): void {
    const dataToExport = this.dataSource.data.map(item => {
      return {
        "Id Mensaje": item.id,
        "Número": item.numero,
        "Fecha Entrada": item.fechaEntrada,
        "Campaña": item.campaña,
        "Mensaje": item.mensaje
      };
    });

    const hojaTrabajo: XSLX.WorkSheet = XSLX.utils.json_to_sheet(dataToExport);
    const libroTrabajo: XSLX.WorkBook = XSLX.utils.book_new();
    XSLX.utils.book_append_sheet(libroTrabajo, hojaTrabajo, 'hoja 1');

    XSLX.writeFile(libroTrabajo, 'REPORTE_DE_MENSAJES.xlsx');
  }

  exportCSV(): void {
    const dataToExport = this.dataSource.data.map(item => {
      return {
       "Id Mensaje": item.id,
        "Número": item.numero,
        "Fecha Entrada": item.fechaEntrada,
        "Campaña": item.campaña,
        "Mensaje": item.mensaje
      };
    });

    const hojaTrabajo: XSLX.WorkSheet = XSLX.utils.json_to_sheet(dataToExport);
    const libroTrabajo: XSLX.WorkBook = XSLX.utils.book_new();
    XSLX.utils.book_append_sheet(libroTrabajo, hojaTrabajo, 'hoja 1');

    XSLX.writeFile(libroTrabajo, 'REPORTE_DE_MENSAJES.csv');
  }

  exportPDF(): void {
    let tablaRegistros: HTMLElement | string =
      document.getElementById('tablaRegistrosMensajes') ?? '';
    let doc = new jsPDF();
    let _elementHandlers = {
      '#editor': function (element: HTMLElement, renderer: any) {
        return true;
      },
    };

    // Convierte la variable tablaRegistros a HTML
    let tablaHTML: HTMLElement = tablaRegistros as HTMLElement;
    const newTable = document.createElement('table');
    newTable.innerHTML = tablaHTML.innerHTML;
    newTable.querySelectorAll('.delete-for-pdf').forEach((el) => el.remove());

    doc.html(newTable, {
      callback: function (doc) {
        doc.save('ReporteMensajes.pdf');
      },
      x: 20, // Cambia la posición horizontal
      y: 10, // Cambia la posición vertical
      width: 100, // Cambia el ancho del contenido HTML en el PDF
      windowWidth: 450, // Cambia el ancho de la página del PDF
    });
  }

}
