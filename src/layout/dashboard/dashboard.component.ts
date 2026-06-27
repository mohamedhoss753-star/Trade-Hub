import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // معرفة الكارت المختار حالياً لتغيير بيانات الرسم البياني بناءً عليه
  selectedMetric = signal<string>('Revenue');

  // بيانات تفاعلية تتغير بتغير الكارت المختار
  chartData = signal([
    { label: 'Jan', value: 50 },
    { label: 'Feb', value: 70 },
    { label: 'Mar', value: 40 },
    { label: 'Apr', value: 85 },
    { label: 'May', value: 95 },
    { label: 'Jun', value: 60 }
  ]);

  selectMetric(metric: string) {
    this.selectedMetric.set(metric);
    
    // محاكاة لتغيير أرقام الأعمدة تفاعلياً حسب اختيارك للكارت
    if (metric === 'Orders') {
      this.chartData.set([
        { label: 'Jan', value: 30 }, { label: 'Feb', value: 40 }, { label: 'Mar', value: 80 },
        { label: 'Apr', value: 55 }, { label: 'May', value: 70 }, { label: 'Jun', value: 90 }
      ]);
    } else {
      this.chartData.set([
        { label: 'Jan', value: 50 }, { label: 'Feb', value: 70 }, { label: 'Mar', value: 40 },
        { label: 'Apr', value: 85 }, { label: 'May', value: 95 }, { label: 'Jun', value: 60 }
      ]);
    }
  }
}
