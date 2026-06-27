
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../app/auth/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }


  register() {

    if (this.registerForm.invalid) {
      console.log('Form Invalid');
      return;
    }

    const form = this.registerForm.value;

    const payload = {
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,

      accountType: 'Individual',
      firstName: form.firstName,
      lastName: form.lastName,
      role: 'User',

      businessName: '',
      locationId: 0,
      logoUrl: '',
      businessTypeId: 0,
      taxNumber: '',

      loginProvider: 'Local'
    };

    console.log('REGISTER PAYLOAD =>', payload);

    this.authService.register(payload).subscribe({

      next: (response: any) => {

        console.log('REGISTER SUCCESS =>', response);

        const userEmail = this.registerForm.value.email;

        this.authService.sendOtp(userEmail).subscribe({

          next: (otpResponse: any) => {

            console.log('OTP SENT =>', otpResponse);

            this.router.navigate(['/verify'], {
              queryParams: { email: userEmail }
            });

          },

          error: (otpError) => {

            console.log('OTP ERROR =>', otpError);

            alert('Failed to send OTP');

          }

        });

      },

    });

  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  goToLogin() { this.router.navigate(['/login']); }
  loginWithGoogle() { this.router.navigate(['/login']); }
  loginWithApple() { this.router.navigate(['/login']); }
  loginWithFacebook() { this.router.navigate(['/login']); }
  loginWithTwitter() { this.router.navigate(['/login']); }
}