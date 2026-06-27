
import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService {

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<any>(null);

  // =========================
  // AUTH
  // =========================

  login(data: any) {
    return this.post<any>('Account/login', data).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

register(data: any) {
  return this.post<any>('Account/register', data).pipe(
    tap(res => {
      this.handleAuthResponse(res);

      localStorage.setItem('userPhone', data.phoneNumber || '');
    })
  );
}

  sendOtp(phoneOrEmail: string) {
    return this.post<any>('Account/send-otp', { phoneOrEmail });
  }

  verifyOtp(phoneOrEmail: string, code: string) {
    return this.post<any>('Account/verify-otp', { phoneOrEmail, code });
  }

  verifyAccount(email: string) {
    return this.post<any>('Account/verify-account', {
      email,
      phone: ''
    });
  }

  resetPassword(data: any) {
    return this.post<any>('Account/reset-password', data);
  }

  // =========================
  // TOKEN
  // =========================

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userToken', token);
    }
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('userToken')
      : null;
  }

  getUserId(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] || '';
    } catch {
      return '';
    }
  }

  isAuthenticated(): boolean {
    return isPlatformBrowser(this.platformId) &&
      !!localStorage.getItem('userToken');
  }

  // =========================
  // ONBOARDING
  // =========================

  setOnboardingStep(step: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('onboardingStep', step);
    }
  }

  getOnboardingStep(): string {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('onboardingStep') || ''
      : '';
  }

  // =========================
  // FILE STATE
  // =========================

  selectedCompanyFile: File | null = null;

  // =========================
  // CURRENT USER
  // =========================

  setCurrentUser(user: any) {
    this.currentUser.set(user);
  }

  getCurrentUser() {
    return this.currentUser();
  }

  // =========================
  // AUTH RESPONSE
  // =========================

  private handleAuthResponse(res: any) {

    if (res?.token) {
      this.setToken(res.token);

      const payload = JSON.parse(atob(res.token.split('.')[1]));

      const userId =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      const email =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

      const fullName = payload["FullName"] || '';

      localStorage.setItem('userId', userId || '');
      localStorage.setItem('userEmail', email || '');
      localStorage.setItem('userName', fullName || '');
      this.setCurrentUser({ userId, email, fullName });
    }
  }

  // =========================
  // LOGOUT
  // =========================

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
  getCompaniesByUserId(userId: string) {
    return this.get<any[]>(`Company/user/${userId}/companies`);
  }
  updateCompany(companyId: string, formData: FormData) {
    return this.put<any>(`Company/${companyId}`, formData);
  }
  createCompany(formData: FormData) {
  return this.post<any>('Company', formData);
}
  getUserName(): string {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('userName') || ''
      : '';
  }
  getProfileImage(): string {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('profileImage') || ''
      : '';
  }
}