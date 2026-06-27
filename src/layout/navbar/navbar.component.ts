import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  private authService = inject(AuthService);

  userName = 'User';
  profileImage = 'assets/images/Ellipse 6.png';

  ngOnInit(): void {

    const name = this.authService.getUserName();

    if (name) {
      this.userName = name;
    }

    const image = this.authService.getProfileImage();

    if (image) {
      this.profileImage = image;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}