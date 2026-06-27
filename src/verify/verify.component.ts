import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../app/auth/services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  otp: string[] = Array(5).fill('');
  email: string = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  goBack() {
    this.router.navigate(['/forget-password']);
  }

  goNext() {
    const fullCode = this.otp.join('');

    if (this.otp.some(d => d === '')) {
      alert('Please enter all 5 digits');
      return;
    }

    if (fullCode.length !== 5) {
      alert('OTP must be 5 digits');
      return;
    }

this.authService.verifyOtp(this.email, fullCode).subscribe({
  next: () => {

    this.authService.verifyAccount(this.email).subscribe({

      next: () => {

        this.authService.setOnboardingStep('business');

        this.router.navigate(['/business'], {
          queryParams: { email: this.email }
        });

      },

      error: (err) => {
        console.error('Verify Account Error:', err);
      }

    });

  },

  error: (err) => {
    console.error('Verify OTP Error:', err);
  }
});
}

  resendCode() {
    if (!this.email) return;

    this.authService.sendOtp(this.email).subscribe({
      next: () => alert('Code resent successfully!'),
      error: () => alert('Failed to resend code.')
    });
  }

  tryAnotherEmail() {
    this.router.navigate(['/forget-password']);
  }
}