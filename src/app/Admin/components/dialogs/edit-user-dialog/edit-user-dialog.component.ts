import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminUsers } from '../../../interfaces/Admin-users.interface';
import { AdminService } from '../../../services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css'],
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
export default class EditUserDialogComponent implements OnInit {
  private adminService = inject(AdminService);
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdminUsers,
  ) { }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.adminService.updateUser(this.data).subscribe({
      next: (updatedUser) => {
        console.log('Usuario actualizado:', updatedUser);
        this.dialogRef.close(updatedUser);
        window.location.reload();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el usuario.',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
        });
        this.dialogRef.close();
      },
    });
  }
}
