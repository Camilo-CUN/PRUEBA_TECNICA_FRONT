import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { ProductService } from '../../../services/product.service';
import { Products } from '../../../interfaces/products.interface';

@Component({
  selector: 'app-confirm-delete',
  template: `
    <h1 mat-dialog-title>¿Está seguro?</h1>
    <mat-dialog-content>
      <p>¿Está seguro de que desea eliminar <strong>{{data.product.name}}</strong>?</p>
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button mat-button style="background-color: green; color: white;" (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Confirmar</button>
    </div>
  `,
  styles: [
    `
      h1 {
        font-size: 20px;
      }
      div[mat-dialog-actions] {
        display: flex;
        justify-content: space-between;
      }
    `,
  ],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export default class ConfirmDeleteProductComponent implements OnInit {
  private productService = inject(ProductService);

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product : Products }
  ) { }

  ngOnInit() {
  }

  onConfirm(): void {
    this.productService.deleteProductById(this.data.product.id).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el producto.',
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true,
        });
      },
    });
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
