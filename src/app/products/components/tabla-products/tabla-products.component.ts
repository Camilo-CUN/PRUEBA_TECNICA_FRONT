import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Products } from '../../interfaces/products.interface';
import { ProductService } from '../../services/product.service';
import * as XSLX from 'xlsx';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import ConfirmDeleteProductComponent from '../dialogs/confirm-delete/confirm-delete-product.component';
import CreateProductDialogComponent from '../dialogs/create-product-dialog/create-product-dialog.component';
import EditProductDialogComponent from '../dialogs/edit-product-dialog/edit-product-dialog.component';

@Component({
  selector: 'app-tabla-products',
  templateUrl: './tabla-products.component.html',
  styleUrls: ['./tabla-products.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatTooltipModule, MatIconModule, CommonModule]
})
export class TablaProductsComponent implements OnInit, AfterViewChecked {
  //Servicios
  private ProductService = inject(ProductService);
  //Variables
  public table: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'description','category', 'amount', 'price', 'actions'];
  dataSource = new MatTableDataSource<Products>();

  constructor(private dialog: MatDialog) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() {
    this.getProducts();
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

  //exportar
  exportExcel(): void {
    const dataToExport = this.dataSource.data.map(item => {
      return {
        "Id Mensaje": item.id,
        "Número": item.name,
        "Fecha Entrada": item.description,
        "category": item.category,
        "amount": item.amount,
        "price": item.price
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
        "Fecha Entrada": item.description,
        "category": item.category,
        "amount": item.amount,
        "price": item.price
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

  //Obtener todos los productos
  getProducts() {
    this.ProductService.onLoading(true);
    this.ProductService.getAllProducts().subscribe({
      next: (res) => {
        this.ProductService.onLoading(false);
        this.dataSource.data = res;
      },
      error: (err) => {
        this.ProductService.onLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener los productos.',
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true,
        });
      },
    });
  }

  //Eliminar producto
  deleteItem(product: Products): void {
    const dialogRef = this.dialog.open(ConfirmDeleteProductComponent, {
      width: '20vw',
      data: { product },
    });
  }


  //Crear producto
  createProduct():void {
    const dialogRef = this.dialog.open(CreateProductDialogComponent, {
      width: '30vw',
    });
  }

  //Editar producto
  editProduct(product: Products): void {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '30vw',
      data: { ...product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Datos editados:', result);
      }
    }
  );}
}
