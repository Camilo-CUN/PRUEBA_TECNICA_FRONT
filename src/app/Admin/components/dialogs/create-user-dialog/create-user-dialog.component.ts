import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../../../services/admin.service';
import Swal from 'sweetalert2';
import { AdminUsers } from '../../../interfaces/Admin-users.interface';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css'],
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
export default class CreateUserDialogComponent implements OnInit {
  public userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rol: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
  ) { }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.userForm.valid) {
      const newUser: AdminUsers = this.userForm.value;
      this.adminService.createUser(newUser).subscribe({
        next: (createdUser) => {
          console.log('Usuario creado:', createdUser);
          Swal.fire({
            title: 'Éxito',
            text: 'Usuario creado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          this.dialogRef.close(createdUser);
          window.location.reload();
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo crear el usuario.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          this.dialogRef.close();
        },
      });
    }
  }
}
