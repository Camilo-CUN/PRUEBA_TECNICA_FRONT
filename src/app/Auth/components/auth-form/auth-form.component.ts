import { Component, Inject, inject, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormGroup, FormControl, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../shared/services/shared.service';
@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css'],
  standalone: true,
  imports:[MatFormFieldModule, MatInputModule, MatIcon, MatButtonModule,MatCheckboxModule,MatDividerModule, ReactiveFormsModule, HttpClientModule, CommonModule]
})
export class AuthFormComponent implements OnInit {
  public hide = true;
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private sharedService = inject(SharedService);

  public formLogin: FormGroup =  this.fb.group({
    username: ['', [Validators.required, Validators.minLength(8)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

      //funcion para validar si un campo es invalido
      isInvalidField(field: string): boolean | null {
        return (
          this.formLogin.controls[field].errors &&
          this.formLogin.controls[field].touched
        );
      }

      //Función para validar los errores del formulario por campo
      getFieldError(field: string): string | null {
        if (!this.formLogin.controls[field]) return null;

        const errors = this.formLogin.controls[field].errors || {};

        for (const key of Object.keys(errors)) {
          switch (key) {
            case 'required':
              return 'Este campo es requerido';
            case 'pattern':
              return 'Debe ingresar un formato válido';
            case 'minlength':
              return `Mínimo ${errors[key].requiredLength} caracteres.`;
            case 'maxlength':
              return `Máximo ${errors[key].requiredLength} caracteres.`;
            case 'min':
              return `El valor debe ser mayor a  ${errors[key].min}.`;
            case 'NoValid':
              return `No Tienes Inscrita la asignatura de pracitcas o tu documento es invalido.`;
            case 'TelefonoNoValido':
              return `Algo salió mal durante la verificación de tu número inténtalo de nuevo.`;
          }
        }

        return null;
      }

  ConsultarUsuario(){
    if(this.formLogin.invalid){
      return
    }
    this.sharedService.onLoading(true);
    this.auth.GetUserData(this.formLogin.value).subscribe({
      next: (data) =>{
        this.sharedService.onLoading(false);
        this.router.navigateByUrl('admin');
      },
      error:(error) =>{
        console.log(this.formLogin.value);
        this.sharedService.onLoading(false);
        Swal.fire({
          title: 'Error',
          text: error.error,
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: true})
      }
    })
  }


  constructor() { }

  ngOnInit() {
  }

}


