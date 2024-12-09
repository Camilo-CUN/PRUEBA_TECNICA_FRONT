import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import Swal from 'sweetalert2';
import {MatTooltipModule} from '@angular/material/tooltip';
import * as XSLX from 'xlsx';
import jsPDF from 'jspdf';
import { AdminService } from '../../services/admin.service';
import { AdminUsers } from '../../interfaces/Admin-users.interface';
import { MatDialog } from '@angular/material/dialog';
import ConfirmDeleteComponent from '../dialogs/confirm-delete/confirm-delete.component';
import EditUserDialogComponent from '../dialogs/edit-user-dialog/edit-user-dialog.component';
import CreateUserDialogComponent from '../dialogs/create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-tabla-users',
  templateUrl: './tabla-users.component.html',
  styleUrls: ['./tabla-users.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatTooltipModule, MatIconModule, CommonModule]
})
export default class TablaUsersComponent implements OnInit, AfterViewChecked {
  //Servicios
  private adminService = inject(AdminService);
  //Variables
  public table: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'email','rol', 'actions'];
  dataSource = new MatTableDataSource<AdminUsers>();

  constructor(private dialog: MatDialog) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() {
    this.getUsers();
  }

  ngAfterViewChecked(): void {
    if (!this.dataSource.sort && this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (!this.dataSource.paginator && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  //Aplicar Filtro
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Obtener usuarios
  getUsers(){
    this.adminService.onLoading(true);
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.adminService.onLoading(false);
        console.log('Usuarios cargados:', res);
        this.dataSource.data = res;
      },
      error: (err) => {
        this.adminService.onLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar los registros',
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true,
        });
      }

    })
  }


  //Eliminar usuario
  deleteItem(user: AdminUsers): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(`Elemento eliminado: ${user.email}`);
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }

  //Editar usuario
  editUser(user: AdminUsers): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '30vw',
      data: { ...user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Datos editados:', result);
      }
    }
  );}


  //Crear usuario
  createUser():void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '30vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Usuario creado:', result);
     }});
  }

  //exportar
  exportExcel(): void {
    const dataToExport = this.dataSource.data.map(item => {
      return {
        "Id Mensaje": item.id,
        "Número": item.name,
        "Fecha Entrada": item.email,
        "rol": item.rol,
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
        "Número": item.name,
        "Fecha Entrada": item.email,
        "rol": item.rol,
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
