
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../app/auth/services/auth.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogINComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

login() {
  if (this.loginForm.invalid) return;

  this.isLoading = true;

  const data = this.loginForm.value;

  this.authService.login(data).subscribe({
    next: (res: any) => {

      console.log('LOGIN RESPONSE =>', res);

      // token already saved inside AuthService
      const userId = this.authService.getUserId();

      if (!userId) {
        this.isLoading = false;
        return;
      }

      // 🔥 IMPORTANT: لا توقف المستخدم على أي check
      this.authService.getCompaniesByUserId(userId).subscribe({
        next: () => {
          // سواء فيه أو مفيش → ادخله النظام
          this.router.navigate(['/layout']);
          this.isLoading = false;
        },

        error: () => {
          // 404 = طبيعي (new user)
          this.router.navigate(['/layout']);
          this.isLoading = false;
        }
      });

    },

    error: (err) => {
      console.error('LOGIN ERROR', err);
      this.isLoading = false;
    }
  });
}

  togglePassword() { this.showPassword = !this.showPassword; }
  goToForgetPassword() { this.router.navigate(['/forget-password']); }
  goToRegister() { this.router.navigate(['/register']); }
  loginWithGoogle() { this.router.navigate(['/business']); }
}