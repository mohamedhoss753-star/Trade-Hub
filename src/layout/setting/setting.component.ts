import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
  billingCycle: 'monthly' | 'yearly' = 'monthly';

  // بيانات الخطط
  plans = [
    {
      name: 'Basic Plan',
      price: 12,
      features: ['Free Domain', 'Google Ads Credit', 'Launch E-Store', 'Free SSL Security', 'Up to 100 Products'],
      limitedFeatures: ['Chat Apps', 'Unlimited Storage', 'No Transaction Fee'],
      buttonText: 'Select Plan'
    },
    {
      name: 'Professional',
      price: 20,
      isPopular: true,
      features: ['Free Domain', 'Google Ads Credit', 'Launch E-Store', 'Free SSL Security', 'Up to 100 Products', 'Chat Apps'],
      limitedFeatures: ['Unlimited Storage', 'No Transaction Fee'],
      buttonText: 'Select Plan'
    },
    {
      name: 'Business',
      price: 45,
      features: ['Free Domain', 'Google Ads Credit', 'Launch E-Store', 'Free SSL Security', 'Up to 100 Products', 'Chat Apps', 'Unlimited Storage', 'No Transaction Fee'],
      limitedFeatures: [],
      buttonText: 'Select Plan'
    }
  ];
}