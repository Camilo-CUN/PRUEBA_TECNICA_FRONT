import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AdminUsers } from '../../../interfaces/Admin-users.interface';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../../services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirm-delete',
  template: `
    <h1 mat-dialog-title>¿Está seguro?</h1>
    <mat-dialog-content>
      <p>¿Está seguro de que desea eliminar <strong>{{data.user.name}}</strong>?</p>
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
export default class ConfirmDeleteComponent implements OnInit {
  private adminService = inject(AdminService);

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user : AdminUsers }
  ) { }

  ngOnInit() {
  }

  onConfirm(): void {
    this.adminService.deleteUserByEmail(this.data.user.email).subscribe({
      next: () => {
        console.log(`Usuario con email ${this.data.user.email} eliminado.`);
        window.location.reload();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el usuario.',
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true,
        });
      },
    });
    this.dialogRef.close(true); // Confirma la acción
  }

  onCancel(): void {
    this.dialogRef.close(false); // Cancela la acción
  }
}
