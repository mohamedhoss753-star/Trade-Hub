import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personalsetting.component.html',
  styleUrls: ['./personalsetting.component.css']
})
export class PersonalsettingComponent implements OnInit {
  activeTab: string = 'profile';
  tabs: string[] = ['profile', 'notifications', 'accounts', 'security'];
  profileImage: string | ArrayBuffer | null = 'assets/default-avatar.png'; // رابط الصورة الافتراضية
  settingsForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      firstName: ['Mohamed'],
      lastName: ['Ali'],
      email: ['mohamed.ali@tradehub.com'],
      phone: ['+20 123 456 7890'],
      language: ['English'],
      timezone: ['(GMT+02:00) Cairo'],
      theme: ['Light'],
      // notifications toggles
      personalizedOffers: [true],
      onlineWebinars: [true],
      newFeatures: [true],
      securityBilling: [false],
      marketing: [false]
    });
  }

  // معالجة تغيير الصورة
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.profileImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  saveSettings(): void {
    console.log('Final Data:', this.settingsForm.value);
    // هنا سيتم الربط مع الـ Service لاحقاً
  }
}