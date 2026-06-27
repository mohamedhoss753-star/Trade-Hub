import { Component, AfterViewInit, OnDestroy, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../app/auth/services/auth.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  address: string = '';
  latitude: number | null = null;
  longitude: number | null = null;

  private map!: L.Map;
  private marker!: L.Marker;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  private initMap(): void {
    const defaultLat = 30.0444;
    const defaultLng = 31.2357;

    this.map = L.map('map-container').setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.updateMarkerPosition(lat, lng);
    });

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.updateMarkerPosition(position.lat, position.lng);
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private updateMarkerPosition(lat: number, lng: number): void {
    this.latitude = lat;
    this.longitude = lng;
    this.marker.setLatLng([lat, lng]);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.display_name) {
          this.address = res.display_name;
        }
      },
      error: (err) => console.error('Error fetching address:', err)
    });
  }

  goBack() { 
    this.router.navigate(['/business']); 
  }

 goNext() {
  if (!this.address.trim()) {
    alert('Please select an address.');
    return;
  }

  localStorage.setItem('businessAddress', this.address);
  // نرسل رقم معرف صحيح متوافق مع الـ Backend (مثال: 1) لحين ربط الـ Dropdown أو الـ API الفعلي للمواقع
  localStorage.setItem('locationId', '1'); 
  
  // حفظ الإحداثيات بشكل منفصل لو احتجتها
  localStorage.setItem('geoLatitude', this.latitude?.toString() || '');
  localStorage.setItem('geoLongitude', this.longitude?.toString() || '');

  this.authService.setOnboardingStep('payment');
  this.router.navigate(['/payment']);
 this.router.navigate(['/payment']);
  }
}