import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  image: string;
}
interface Category {
  id: number;
  name: string;
  itemCount: number;
  image: string;
  visible: boolean;
  products: Product[];
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  
  // التحكم في الـ Views: الآن يدعم 'grid' و 'details' و 'create'
  currentView = signal<'grid' | 'details' | 'create'>('grid');
  
  // الـ Signal الأساسي للأقسام
  categories = signal<Category[]>([]);

  // كائنات التحكم في التعديل والإضافة
  editableCategory: Category | null = null;
  newCategory!: Category;

 constructor() {
    // 1. التأكد أولاً أننا داخل بيئة المتصفح قبل استدعاء localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCategories = localStorage.getItem('tradehub_categories');
      if (savedCategories) {
        this.categories.set(JSON.parse(savedCategories));
      } else {
        this.loadMockData();
      }
    } else {
      // داتا مبدئية للسيرفر أثناء الـ SSR حتى لا تظهر الصفحة بيضاء
      this.loadMockData();
    }

    // 2. حماية الـ effect أيضاً للتأكد أنه لا يحاول الحفظ إلا في المتصفح
    effect(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('tradehub_categories', JSON.stringify(this.categories()));
      }
    });
  }

  // فتح صفحة إضافة كاتيغوري جديدة وتصفير البيانات ليملأها المستخدم
  openCreateView() {
    this.newCategory = {
      id: Date.now(),
      name: '',
      itemCount: 0,
      image: '', // هتتحدث لما يرفع صورة
      visible: true,
      products: []
    };
    this.currentView.set('create');
  }

  // حفظ الكاتيغوري الجديدة التي أنشأها المستخدم بنفسه
  saveNewCategory() {
    if (!this.newCategory.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    if (!this.newCategory.image) {
      alert('Please select an image for the category');
      return;
    }
    
    this.categories.update(current => [this.newCategory, ...current]);
    this.currentView.set('grid');
  }

  // دالة معالجة رفع وتحميل الصور دايناميكياً من الجهاز وتحويلها لـ Base64
  onImageSelected(event: Event, target: 'edit' | 'create') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64Image = e.target?.result as string;
        if (target === 'edit' && this.editableCategory) {
          this.editableCategory.image = base64Image;
        } else if (target === 'create') {
          this.newCategory.image = base64Image;
        }
      };
      
      reader.readAsDataURL(file);
    }
  }

  // فتح صفحة التعديل
  editCategory(category: Category) {
    this.editableCategory = structuredClone(category);
    this.currentView.set('details');
  }

  // حفظ تعديلات الكاتيغوري الحالية
  saveChanges() {
    if (this.editableCategory) {
      this.editableCategory.itemCount = this.editableCategory.products.length;
      const updated = this.editableCategory;
      
      this.categories.update(current => 
        current.map(cat => cat.id === updated.id ? updated : cat)
      );
      
      this.currentView.set('grid');
      this.editableCategory = null;
    }
  }

  cancelEdit() {
    this.currentView.set('grid');
    this.editableCategory = null;
  }

  // إدارة المنتجات داخل الكاتيغوري
  addProduct() {
    if (this.editableCategory) {
      const newProd = {
        id: Date.now(),
        name: 'New Product Item',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518'
      };
      this.editableCategory.products.push(newProd);
    }
  }

  deleteProduct(productId: number) {
    if (this.editableCategory) {
      this.editableCategory.products = this.editableCategory.products.filter(p => p.id !== productId);
    }
  }

  private loadMockData() {
    this.categories.set([
      {
        id: 1,
        name: 'Men Clothes',
        itemCount: 24,
        image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e',
        visible: true,
        products: []
      },
      {
        id: 2,
        name: 'Women Clothes',
        itemCount: 12,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
        visible: true,
        products: [
          { id: 101, name: 'Women Striped T-Shirt', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c' }
        ]
      }
    ]);
  }
}