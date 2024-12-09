import { OverlayModule } from '@angular/cdk/overlay';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LayoutComponent } from '../../../Shared/components/layout/layout.component';
import { SpinnerComponent } from '../../../Shared/components/spinner/spinner.component';
import { AdminService } from '../../../Admin/services/admin.service';
import { TablaProductsComponent } from '../../components/tabla-products/tabla-products.component';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
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
    TablaProductsComponent
    ]
})
export default class ProductsPageComponent implements OnInit {
  public adminService = inject(AdminService)
  get loading() : boolean {
    return this.adminService.loading()
  }
  constructor() { }

  ngOnInit() {
  }

}
