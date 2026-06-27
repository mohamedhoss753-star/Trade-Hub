import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../app/auth/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset.component.html', // تأكد من اسم الملف
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  newPassword = '';
  confirmPassword = '';
  email = ''; // لاستقبال الإيميل

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit() {
    // استقبال الإيميل من الـ QueryParams
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  goBack() {
    this.router.navigate(['/verify']);
  }

 resetPassword() {

 const email = this.email || localStorage.getItem('resetEmail');

const payload = {
  email,
  newPassword: this.newPassword
};

  this.authService.resetPassword(payload).subscribe({
    next: () => {
      alert('Password updated');
      this.router.navigate(['/login']);
    }
  });
}
}
