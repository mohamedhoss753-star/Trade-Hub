import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../app/auth/services/auth.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  // بيانات مالك الحساب المسترجعة من الـ Register/Login
  ownerName: string = '';
  ownerEmail: string = '';
  ownerPhone: string = '';

  // بيانات البزنس والموقع والدفع
  businessName: string = '';
  businessType: string = '';
  businessEmail: string = '';
  address: string = '';
  paymentMethod: string = '';
  merchantId: string = '';
  integrationId: string = '';

  isConfirmed: boolean = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllData();
    }
  }

  private loadAllData(): void {
    // جلب بيانات المالك المجمعة من الخطوة الأولى
    const user = this.authService.getCurrentUser();

    this.ownerName =
      user?.fullName || localStorage.getItem('userName') || 'N/A';

    this.ownerEmail =
      user?.email || localStorage.getItem('userEmail') || 'N/A';

    this.ownerPhone =
      localStorage.getItem('userPhone') || '';
    // جلب بيانات البزنس
    this.businessName = localStorage.getItem('businessName') || 'N/A';
    this.businessEmail = localStorage.getItem('businessEmail') || 'N/A';
    this.businessType = localStorage.getItem('businessTypeName') || 'N/A';

    // جلب بيانات الموقع والدفع
    this.address = localStorage.getItem('businessAddress') || 'N/A';
    this.paymentMethod = localStorage.getItem('paymentMethod') || 'N/A';
    this.merchantId = localStorage.getItem('paymentMerchantId') || 'N/A';
    this.integrationId = localStorage.getItem('paymentIntegrationId') || 'N/A';
  }

  goBack() {
    this.router.navigate(['/payment']);
  }

submit() {
  if (!this.isConfirmed) {
    alert('Please confirm that all information provided is correct.');
    return;
  }

  // ===== Demo Mode =====
  this.authService.setOnboardingStep('completed');
  this.router.navigate(['/layout']);
  return;

  // باقي الكود القديم يفضل موجود تحت بدون حذف
}


  private clearOnboardingStorage(): void {
    // تنظيف مفاتيح الفلو المؤقتة والإبقاء على التوكن والـ User الأساسيين
    const keysToRemove = [
      'businessName', 'businessEmail', 'businessTypeId', 'businessTypeName',
      'taxNumber', 'businessNumber', 'businessDescription', 'businessAddress',
      'locationId', 'geoLatitude', 'geoLongitude', 'paymentMerchantId',
      'paymentIntegrationId', 'paymentMethod', 'businessLogoPreview'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}