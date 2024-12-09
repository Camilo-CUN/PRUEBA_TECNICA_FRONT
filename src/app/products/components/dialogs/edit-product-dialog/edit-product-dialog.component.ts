import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { Products } from '../../../interfaces/products.interface';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.css'],
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ]
})
export default class EditProductDialogComponent implements OnInit {
  private productService = inject(ProductService);
  constructor(
    public dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Products,
  ) { }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.productService.updateProduct(this.data).subscribe({
      next: (updatedProduct) => {
        console.log('Usuario actualizado:', updatedProduct);
        this.dialogRef.close(updatedProduct);
        window.location.reload();
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el producto.',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
        });
        this.dialogRef.close();
      },
    });
  }
}
