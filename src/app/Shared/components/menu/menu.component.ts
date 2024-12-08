import { Component, OnInit } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [MatListModule,MatButtonModule]
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
