import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

interface Coupon {
  id: number;
  name: string;
  code: string;
  usage: number;
  isActive: boolean;
  dateRange: string;
}

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './copoun.component.html',
  styleUrls: ['./copoun.component.css']
})
export class CopounComponent implements OnInit {
  
  // حالة الـ Modal وطبيعة العملية (إنشاء أو تعديل)
  isModalOpen = false;
  isEditMode = false;
  editingCouponId: number | null = null;

  // الحالات النشطة للفلاتر والبحث والصفحات
  activeTab: string = 'all'; 
  filterStatus: string = 'all';
  searchQuery: string = '';
  
  // التحكم في الصفحات (Pagination)
  currentPage: number = 1;
  pageSize: number = 3; // عدد العناصر في الصفحة الواحدة لتجربة التقليب فوراً

  // إدارة الاختيارات (Checkboxes)
  selectedCouponIds: Set<number> = new Set<number>();

  // خيارات نوع الكوبون والفورم
  selectedType: string = 'fixed';
  couponForm!: FormGroup;
  categories: string[] = ['All Products', 'Women Clothes', 'Electronics', 'Men Shoes'];

  // البيانات الأساسية
  coupons: Coupon[] = [
    { id: 1, name: 'Summer discount 10% off', code: 'Summer2026', usage: 75, isActive: true, dateRange: '2026-05-05 - 2026-05-15' },
    { id: 2, name: 'Free shipping on all items', code: 'FreeShip2026', usage: 42, isActive: true, dateRange: '2026-05-05 - 2026-05-15' },
    { id: 3, name: 'Discount for women clothes 15%', code: 'Women15', usage: 12, isActive: false, dateRange: '2026-02-14 - 2026-02-20' },
    { id: 4, name: 'Black Friday Super Deal', code: 'BF2026', usage: 110, isActive: false, dateRange: '2026-11-20 - 2026-11-30' },
    { id: 5, name: 'Ramadan Kareem Gift', code: 'Ramadan26', usage: 5, isActive: true, dateRange: '2026-03-01 - 2026-03-30' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.couponForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', Validators.required],
      discountValue: ['', Validators.required],
      appliesTo: ['All Products'],
      duration: [''],
      noDuration: [false],
      usageLimit: [''],
      noLimit: [false]
    });

    // التحكم الديناميكي في تفعيل الحقول بناءً على الـ Checkboxes
    this.couponForm.get('noDuration')?.valueChanges.subscribe(checked => {
      const ctrl = this.couponForm.get('duration');
      checked ? (ctrl?.disable(), ctrl?.setValue('')) : ctrl?.enable();
    });

    this.couponForm.get('noLimit')?.valueChanges.subscribe(checked => {
      const ctrl = this.couponForm.get('usageLimit');
      checked ? (ctrl?.disable(), ctrl?.setValue('')) : ctrl?.enable();
    });
  }

  // مصفاة البيانات الديناميكية (البحث + التبويبات + الفلتر الجانبي)
  get filteredCoupons(): Coupon[] {
    return this.coupons.filter(coupon => {
      const matchesSearch = coupon.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            coupon.code.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const statusValue = this.activeTab !== 'all' ? this.activeTab : this.filterStatus;
      const matchesStatus = statusValue === 'all' ? true : 
                            statusValue === 'active' ? coupon.isActive : !coupon.isActive;

      return matchesSearch && matchesStatus;
    });
  }

  // تقسيم البيانات المقسمة صفحات (Paginated Coupons)
  get paginatedCoupons(): Coupon[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCoupons.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCoupons.length / this.pageSize) || 1;
  }

  // أزرار التنقل بين الصفحات
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // إدارة اختيار السطور
  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.paginatedCoupons.forEach(c => this.selectedCouponIds.add(c.id));
    } else {
      this.paginatedCoupons.forEach(c => this.selectedCouponIds.delete(c.id));
    }
  }

  toggleSelectCoupon(id: number): void {
    this.selectedCouponIds.has(id) ? this.selectedCouponIds.delete(id) : this.selectedCouponIds.add(id);
  }

  isCouponSelected(id: number): boolean {
    return this.selectedCouponIds.has(id);
  }

  isAllSelected(): boolean {
    return this.paginatedCoupons.length > 0 && this.paginatedCoupons.every(c => this.selectedCouponIds.has(c.id));
  }

  // عمليات السلة والقلم (حذف وتعديل)
  deleteSelected(): void {
    if (this.selectedCouponIds.size === 0) return;
    if (confirm('Are you sure you want to delete the selected items?')) {
      this.coupons = this.coupons.filter(c => !this.selectedCouponIds.has(c.id));
      this.selectedCouponIds.clear();
      this.currentPage = 1;
    }
  }

  deleteSingle(id: number): void {
    if (confirm('Delete this coupon?')) {
      this.coupons = this.coupons.filter(c => c.id !== id);
      this.selectedCouponIds.delete(id);
      this.currentPage = 1;
    }
  }

  editSelected(): void {
    if (this.selectedCouponIds.size !== 1) {
      alert('Please select exactly one coupon to edit using the checkboxes, or click the pen directly on the row.');
      return;
    }
    const id = Array.from(this.selectedCouponIds)[0];
    this.openEditModal(id);
  }

  openEditModal(id: number): void {
    const coupon = this.coupons.find(c => c.id === id);
    if (!coupon) return;

    this.isEditMode = true;
    this.editingCouponId = id;
    this.isModalOpen = true;

    // فصل التاريخ إذا وجد لتعبئته داخل الـ input
    const singleDate = coupon.dateRange.includes(' - ') ? coupon.dateRange.split(' - ')[0] : '';

    this.couponForm.patchValue({
      code: coupon.code,
      name: coupon.name,
      discountValue: coupon.usage, // محاكاة لقيمة الخصم القديمة
      noDuration: coupon.dateRange === 'Always Active',
      duration: singleDate
    });

    document.body.style.overflow = 'hidden';
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingCouponId = null;
    this.isModalOpen = true;
    this.initForm();
    this.selectedType = 'fixed';
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  selectType(type: string): void {
    this.selectedType = type;
    const valCtrl = this.couponForm.get('discountValue');
    type === 'free_shipping' ? (valCtrl?.setValue('0'), valCtrl?.disable()) : valCtrl?.enable();
  }

  // حفظ النهائي (إنشاء أو تعديل)
  saveCoupon(): void {
    if (this.couponForm.invalid) {
      this.couponForm.markAllAsTouched();
      return;
    }

    const raw = this.couponForm.getRawValue();
    const dateStr = raw.noDuration ? 'Always Active' : (raw.duration ? `${raw.duration} - Open` : 'No Date Set');

    if (this.isEditMode && this.editingCouponId !== null) {
      // وضع التعديل (Edit Mode)
      this.coupons = this.coupons.map(c => c.id === this.editingCouponId ? {
        ...c,
        name: raw.name,
        code: raw.code,
        dateRange: dateStr
      } : c);
    } else {
      // وضع الإنشاء (Create Mode)
      const newCoupon: Coupon = {
        id: Date.now(),
        name: raw.name,
        code: raw.code,
        usage: 0,
        isActive: true,
        dateRange: dateStr
      };
      this.coupons.unshift(newCoupon);
    }

    this.closeModal();
    this.currentPage = 1;
  }

  // دوال لتغيير التبويبات والصفحات الفورية
  changeTab(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  onFilterChange(event: any): void {
    this.filterStatus = event.target.value;
    this.currentPage = 1;
  }

  onSearch(): void {
    this.currentPage = 1;
  }
}