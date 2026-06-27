import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuth = auth.isAuthenticated();

  const publicRoutes = [
    '/login',
    '/register',
    '/forget-password',
    '/verify',
    '/reset-password'
  ];

  if (!isAuth) {
    return publicRoutes.some(r => state.url.startsWith(r))
      ? true
      : router.createUrlTree(['/login']);
  }

  const step = auth.getOnboardingStep();

  if (step === 'completed') {
    if (publicRoutes.some(r => state.url.startsWith(r))) {
      return router.createUrlTree(['/layout']);
    }
    return true;
  }

  if (!step) {
    return router.createUrlTree(['/business']);
  }

  switch (step) {
    case 'business':
      return state.url.startsWith('/business')
        ? true
        : router.createUrlTree(['/business']);

    case 'location':
      return state.url.startsWith('/location')
        ? true
        : router.createUrlTree(['/location']);

    case 'payment':
      return state.url.startsWith('/payment')
        ? true
        : router.createUrlTree(['/payment']);

    case 'confirm':
      return state.url.startsWith('/confirm')
        ? true
        : router.createUrlTree(['/confirm']);
  }

  return true;
};