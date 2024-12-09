import { OverlayModule } from '@angular/cdk/overlay';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LayoutComponent } from '../../../Shared/components/layout/layout.component';
import { SpinnerComponent } from '../../../Shared/components/spinner/spinner.component';
import { AdminService } from '../../services/admin.service';
import {MatCardModule} from '@angular/material/card';
import TablaUsersComponent from '../../components/tabla-users/tabla-users.component';

@Component({
  selector: 'app-admin-users-page',
  templateUrl: './admin-users-page.component.html',
  styleUrls: ['./admin-users-page.component.css'],
  standalone: true,
  imports: [LayoutComponent,
    SpinnerComponent,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    OverlayModule,
    TablaUsersComponent
    ]
})
export default class AdminUsersPageComponent implements OnInit {
  public adminService = inject(AdminService)
  get loading() : boolean {
    return this.adminService.loading()
  }
  constructor() { }

  ngOnInit() {
  }

}
