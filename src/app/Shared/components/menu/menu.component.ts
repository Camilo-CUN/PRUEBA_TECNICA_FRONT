import { Component, inject, OnInit } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../../Auth/services/auth.service';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [MatListModule,MatButtonModule]
})
export class MenuComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);
  constructor() { }

  ngOnInit() {
  }

  onLogout(): void {
    this.authService.logOut();
    this.router.navigate(['/login']);
    this.bottomSheet.dismiss();
  }

  onNavigate(route: string): void{
    this.router.navigate([route]);
    this.bottomSheet.dismiss();
  }
}
