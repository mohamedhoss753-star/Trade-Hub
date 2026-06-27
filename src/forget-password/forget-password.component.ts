import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../app/auth/services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {

  email: string = ''; 

  private router = inject(Router);
  private authService = inject(AuthService);

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToVerify() {

    if (!this.email) {
      alert('Please enter your email address');
      return;
    }

    this.authService.sendOtp(this.email).subscribe({
      next: () => {

        // 🔥 مهم: نحدد إن ده reset password flow
        this.router.navigate(['/verify'], {
          queryParams: {
            email: this.email,
            mode: 'reset'   // 👈 الفرق المهم
          }
        });

      },
      error: (err) => {
        console.error(err);
        alert('Failed to send OTP');
      }
    });
  }
}