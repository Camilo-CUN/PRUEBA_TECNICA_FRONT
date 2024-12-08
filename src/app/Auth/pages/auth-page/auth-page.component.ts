import { Component, inject, OnInit } from '@angular/core';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { SpinnerComponent } from '../../../Shared/components/spinner/spinner.component';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css'],
  standalone: true,
  imports: [AuthFormComponent, SpinnerComponent]
})
export default class AuthPageComponent implements OnInit {
  private sharedService = inject(SharedService);
  get loading(): boolean {
    return this.sharedService.loading();
  }
  constructor() { }

  ngOnInit() {
  }

}
