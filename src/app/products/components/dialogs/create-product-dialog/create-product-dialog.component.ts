import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { ProductService } from '../../../services/product.service';
import { Products } from '../../../interfaces/products.interface';

@Component({
  selector: 'app-create-product-dialog',
  templateUrl: './create-product-dialog.component.html',
  styleUrls: ['./create-product-dialog.component.css'],
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule
    ]
})
export default class CreateProductDialogComponent implements OnInit {
  public productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    foto: ['', [Validators.required]],
    category: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0)]],
    price: ['', [Validators.required]]
  });
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<CreateProductDialogComponent>,
  ) { }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.productForm.valid) {
      const product: Products = {
        ...this.productForm.value,
      };
      this.productService.createProduct(product).subscribe({
        next: (createdProduct) => {
          console.log('Usuario creado:', createdProduct);
          Swal.fire({
            title: 'Éxito',
            text: 'producto creado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          this.dialogRef.close(createdProduct);
          window.location.reload();
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo crear el producto.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          this.dialogRef.close();
        },
      });
    }
  }
}
