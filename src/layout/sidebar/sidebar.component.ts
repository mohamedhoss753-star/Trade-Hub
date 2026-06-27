import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // القائمة الأساسية بأيقونات Font Awesome المتوافقة مع الصورة
  mainMenu = [
    { label: 'Dashboard', route: '/layout', icon: 'fas fa-home' },
    { label: 'Orders', route: 'orders', icon: 'fas fa-sliders-h' }, // أو استخدم fas fa-exchange-alt
    { label: 'Products', route: 'products', icon: 'fas fa-tag' },
    { label: 'Category', route: 'category', icon: 'fas fa-folder' },
    { label: 'Customers', route: 'customers', icon: 'fas fa-users' },
    { label: 'Copoun', route: 'copoun', icon: 'fas fa-star' },
  ];

  // قسم الإعدادات
  settingsMenu = [
    { label: 'Personal Settings', route: 'personalsetting', icon: 'fas fa-user-cog' },
    { label: 'Global Settings', route: 'setting', icon: 'fas fa-cog' }
  ];
}

