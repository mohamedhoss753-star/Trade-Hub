// import { Routes } from '@angular/router';
// import { authGuard } from './auth/guards/auth.guard';

// export const routes: Routes = [

//   // PUBLIC
//   { path: '', loadComponent: () => import('../home/home.component').then(m => m.HomeComponent) },
//   { path: 'login', loadComponent: () => import('../log-in/log-in.component').then(m => m.LogINComponent) },
//   { path: 'register', loadComponent: () => import('../register/register.component').then(m => m.RegisterComponent) },

//   // FORGOT PASSWORD FLOW
//   { path: 'forget-password', loadComponent: () => import('../forget-password/forget-password.component').then(m => m.ForgetPasswordComponent) },
//   { path: 'verify', loadComponent: () => import('../verify/verify.component').then(m => m.VerifyComponent) },
//   { path: 'reset-password', loadComponent: () => import('../reset/reset.component').then(m => m.ResetComponent) },

//   // ONBOARDING FLOW
//   { path: 'business', loadComponent: () => import('../business/business.component').then(m => m.BusinessComponent) },
//   { path: 'location', loadComponent: () => import('../location/location.component').then(m => m.LocationComponent) },
//   { path: 'payment', loadComponent: () => import('../payment/payment.component').then(m => m.PaymentComponent) },
//   { path: 'confirm', loadComponent: () => import('../confirm/confirm.component').then(m => m.ConfirmComponent) },

//   // DASHBOARD
//   {
//     path: 'layout',
//     // canActivate: [authGuard],
//     loadComponent: () => import('../layout/layout.component').then(m => m.LayoutComponent),
//     children: [
//       { path: '', loadComponent: () => import('../layout/dashboard/dashboard.component').then(m => m.DashboardComponent) },
//       { path: 'dashboard', loadComponent: () => import('../layout/dashboard/dashboard.component').then(m => m.DashboardComponent) },
//       { path: 'orders', loadComponent: () => import('../layout/orders/orders.component').then(m => m.OrdersComponent) },
//       { path: 'products', loadComponent: () => import('../layout/products/products.component').then(m => m.ProductsComponent) },
//       { path: 'category', loadComponent: () => import('../layout/category/category.component').then(m => m.CategoryComponent) },
//       { path: 'customers', loadComponent: () => import('../layout/customers/customers.component').then(m => m.CustomersComponent) },
//       { path: 'copoun', loadComponent: () => import('../layout/copoun/copoun.component').then(m => m.CopounComponent) },
//       { path: 'setting', loadComponent: () => import('../layout/setting/setting.component').then(m => m.SettingComponent) },
//       { path: 'personalsetting', loadComponent: () => import('../layout/personalsetting/personalsetting.component').then(m => m.PersonalsettingComponent) }

//     ]
//   },

//   { path: '**', redirectTo: '' }
// ];
import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [

  // PUBLIC
  { path: '', loadComponent: () => import('../home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('../log-in/log-in.component').then(m => m.LogINComponent) },
  { path: 'register', loadComponent: () => import('../register/register.component').then(m => m.RegisterComponent) },

  // FORGOT PASSWORD FLOW
  { path: 'forget-password', loadComponent: () => import('../forget-password/forget-password.component').then(m => m.ForgetPasswordComponent) },
  { path: 'verify', loadComponent: () => import('../verify/verify.component').then(m => m.VerifyComponent) },
  { path: 'reset-password', loadComponent: () => import('../reset/reset.component').then(m => m.ResetComponent) },

  // ONBOARDING FLOW
  { path: 'business', loadComponent: () => import('../business/business.component').then(m => m.BusinessComponent) },
  { path: 'location', loadComponent: () => import('../location/location.component').then(m => m.LocationComponent) },
  { path: 'payment', loadComponent: () => import('../payment/payment.component').then(m => m.PaymentComponent) },
  { path: 'confirm', loadComponent: () => import('../confirm/confirm.component').then(m => m.ConfirmComponent) },

  // DASHBOARD
  {
    path: 'layout',
    // canActivate: [authGuard],
    loadComponent: () => import('../layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', loadComponent: () => import('../layout/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'dashboard', loadComponent: () => import('../layout/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'orders', loadComponent: () => import('../layout/orders/orders.component').then(m => m.OrdersComponent) },
      
      // --- PRODUCTS MANAGEMENT ---
      { path: 'products', loadComponent: () => import('../layout/products/products.component').then(m => m.ProductComponent) },
     
      // ----------------------------

      { path: 'category', loadComponent: () => import('../layout/category/category.component').then(m => m.CategoryComponent) },
      { path: 'customers', loadComponent: () => import('../layout/customers/customers.component').then(m => m.CustomersComponent) },
      { path: 'copoun', loadComponent: () => import('../layout/copoun/copoun.component').then(m => m.CopounComponent) },
      { path: 'setting', loadComponent: () => import('../layout/setting/setting.component').then(m => m.SettingComponent) },
      { path: 'personalsetting', loadComponent: () => import('../layout/personalsetting/personalsetting.component').then(m => m.PersonalsettingComponent) }
    ]
  },

  { path: '**', redirectTo: '' }
];