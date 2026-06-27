import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID);

  const excluded = [
    '/Account/login',
    '/Account/register',
    '/Account/send-otp',
    '/Account/verify-otp',
    '/Account/reset-password'
  ];

  if (excluded.some(url => req.url.includes(url))) {
    return next(req);
  }

  let token: string | null = null;

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('userToken');
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};