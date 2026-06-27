import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  // استخدمنا الـ inject للتوافق مع أحدث أسلوب في أنجولار 17+ وحافظنا على الـ Router
  private router = inject(Router);

  merchantId: string = '';
  integrationId: string = '';
  paymentMethod: string = '';

  goBack() {
    this.router.navigate(['/location']);
  }

  goNext() {
    // 🔒 التحقق من أن المستخدم أدخل البيانات الأساسية قبل الانتقال للخطوة الأخيرة
    if (!this.merchantId.trim() || !this.integrationId.trim()) {
      alert('Please fill in Merchant ID and Integration ID.');
      return;
    }

    // 💾 حفظ بيانات الدفع في الـ localStorage لتجميعها في صفحة الـ Confirm
    localStorage.setItem('paymentMerchantId', this.merchantId);
    localStorage.setItem('paymentIntegrationId', this.integrationId);
    localStorage.setItem('paymentMethod', this.paymentMethod || 'Credit Card'); // قيمة افتراضية لو فارغة

    console.log('Saved Payment Data:', {
      merchantId: this.merchantId,
      integrationId: this.integrationId,
      paymentMethod: this.paymentMethod
    });

    // الانتقال الآمن لصفحة التأكيد
    this.router.navigate(['/confirm']);
  }
}