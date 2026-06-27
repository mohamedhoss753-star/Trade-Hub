// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import {NavbarComponent} from '../layout/navbar/navbar.component';
// import { SidebarComponent } from './sidebar/sidebar.component';


// @Component({
//   selector: 'app-layout',
//   standalone: true,
//   imports: [RouterOutlet,NavbarComponent,SidebarComponent],
//   templateUrl: './layout.component.html',
//   styleUrl: './layout.component.css'
// })
// export class LayoutComponent {

// }
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  
}
