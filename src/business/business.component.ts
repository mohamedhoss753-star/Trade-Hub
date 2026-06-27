import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../app/auth/services/auth.service';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  businessName: string = '';
  businessEmail: string = '';
  businessTypeId: number = 0;
  taxNumber: string = '';
  businessNumber: string = '';
  description: string = '';

  selectedLogo: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;

  // الخرائط الخاصة بمسميات الأنواع بحسب الـ Options الموجودة بالـ HTML للـ Confirm
  private businessTypesMap: { [key: number]: string } = {
    1: 'Real Estate & Properties',
    2: 'Mobiles & Tablets',
    3: 'Electronics & Appliances',
    4: 'Furniture & Decor',
    5: 'Fashion & Beauty',
    6: 'Pets',
    7: 'Cars'
  };

  goBack() {
    this.router.navigate(['/register']);
  }

  goNext() {
    if (!this.businessName.trim() || !this.businessEmail.trim() || !this.businessTypeId) {
      alert('Please fill in all required fields: Business Name, Email, Business Type.');
      return;
    }

    // حفظ البيانات في الـ localStorage لاستخدامها بالـ Confirm والـ API لاحقاً
    localStorage.setItem('businessName', this.businessName);
    localStorage.setItem('businessEmail', this.businessEmail);
    localStorage.setItem('businessTypeId', this.businessTypeId.toString());
    localStorage.setItem('businessTypeName', this.businessTypesMap[this.businessTypeId] || '');
    localStorage.setItem('taxNumber', this.taxNumber);
    localStorage.setItem('businessNumber', this.businessNumber);
    localStorage.setItem('businessDescription', this.description);

    // تحديث الخطوة والانتقال لصفحة الخريطة
    this.authService.setOnboardingStep('location');
    this.router.navigate(['/location']);
  }

onLogoSelect(event: any) {
  const file = event.target.files[0];
  if (file) {
    // حفظ الملف الفعلي في السيرفس ليتم إرساله في خطوة الـ Confirm
    this.authService.selectedCompanyFile = file; 

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedLogo = reader.result;
      // حفظ النسخة النصية للعرض فقط كـ Preview في صفحة الـ Confirm
      // localStorage.setItem('businessLogoPreview', reader.result as string); 
    };
    reader.readAsDataURL(file);
  }
}
}