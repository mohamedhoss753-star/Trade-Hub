import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
  private fb = inject(FormBuilder);

  isCreateOpen = signal<boolean>(false);
  isEditOpen = signal<boolean>(false);
  isDeleteOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  imagePreview = signal<string | null>(null);
  selectedProduct = signal<any | null>(null);

  allProducts = signal<any[]>([]);

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.allProducts();
    return this.allProducts().filter(p => p.name.toLowerCase().includes(query));
  });

  availableCategories: string[] = ['Women', 'Men', 'T-Shirt', 'Hoodie', 'Dress'];
  productForm!: FormGroup;
  private STORAGE_KEY = 'tradehub_products_v2';

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  initForm() {
    this.productForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      discountPrice: [null],
      addTax: [false],
      hasOptions: [false],
      options: this.fb.array([]),
      weight: [''],
      country: [''],
      isDigital: [false],
      categories: this.fb.group({
        Women: [false],
        Men: [false],
        'T-Shirt': [false],
        Hoodie: [false],
        Dress: [false]
      }),
      tags: [[]],
      seoTitle: [''],
      seoDescription: [''],
      imageUrl: [''],
      quantity: [96],
      color: ['White']
    });

    this.productForm.get('hasOptions')?.valueChanges.subscribe((hasOptions: boolean) => {
      const optionsArray = this.optionsArray;
      if (hasOptions && optionsArray.length === 0) {
        this.addOptionRow();
      } else if (!hasOptions) {
        optionsArray.clear();
      }
    });
  }

  get optionsArray(): FormArray {
    return this.productForm.get('options') as FormArray;
  }

  createOptionGroup(type = 'Size', values: string[] = []): FormGroup {
    return this.fb.group({
      type: [type],
      values: [values]
    });
  }

  addOptionRow() {
    this.optionsArray.push(this.createOptionGroup('Size', []));
  }

  removeOptionRow(index: number) {
    this.optionsArray.removeAt(index);
  }

  addOptionValue(index: number, event: any) {
    event.preventDefault();
    const input = event.target;
    const value = input.value.trim();
    if (value) {
      const group = this.optionsArray.at(index) as FormGroup;
      const currentValues = group.get('values')?.value || [];
      if (!currentValues.includes(value)) {
        group.get('values')?.setValue([...currentValues, value]);
      }
      input.value = '';
    }
  }

  removeOptionValue(optIdx: number, valIdx: number) {
    const group = this.optionsArray.at(optIdx) as FormGroup;
    const currentValues = group.get('values')?.value || [];
    currentValues.splice(valIdx, 1);
    group.get('values')?.setValue([...currentValues]);
  }

  addTagElement(event: any) {
    event.preventDefault();
    const input = event.target;
    const value = input.value.trim();
    if (value) {
      const currentTags = this.productForm.get('tags')?.value || [];
      if (!currentTags.includes(value)) {
        this.productForm.get('tags')?.setValue([...currentTags, value]);
      }
      input.value = '';
    }
  }

  removeTagElement(tagToRemove: string) {
    const currentTags = this.productForm.get('tags')?.value || [];
    this.productForm.get('tags')?.setValue(currentTags.filter((t: string) => t !== tagToRemove));
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
      this.productForm.get('imageUrl')?.setValue(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  openCreate() {
    this.imagePreview.set(null);
    this.initForm();
    this.isCreateOpen.set(true);
  }

  openEdit(item: any) {
    this.selectedProduct.set(item);
    this.imagePreview.set(item.imageUrl || null);
    this.initForm();
    
    if (item.options && item.options.length > 0) {
      this.optionsArray.clear();
      item.options.forEach((opt: any) => {
        this.optionsArray.push(this.createOptionGroup(opt.type, [...opt.values]));
      });
    }

    this.productForm.patchValue(item);
    this.isEditOpen.set(true);
  }

  closeForm() {
    this.isCreateOpen.set(false);
    this.isEditOpen.set(false);
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    const formRawValues = this.productForm.getRawValue();
    const activeCategories = Object.keys(formRawValues.categories)
      .filter(key => formRawValues.categories[key]);

    const newProduct = {
      ...formRawValues,
      id: Date.now(),
      categoryName: activeCategories.length > 0 ? activeCategories.join(', ') : 'T-Shirt'
    };

    this.allProducts.update(list => {
      const updatedList = [newProduct, ...list];
      this.saveLocalStorage(updatedList);
      return updatedList;
    });

    this.closeForm();
  }

  saveEdit() {
    if (this.productForm.invalid) return;

    const formRawValues = this.productForm.getRawValue();
    const activeCategories = Object.keys(formRawValues.categories)
      .filter(key => formRawValues.categories[key]);

    const updatedProduct = {
      ...formRawValues,
      categoryName: activeCategories.length > 0 ? activeCategories.join(', ') : 'T-Shirt'
    };

    this.allProducts.update(list => {
      const updatedList = list.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      this.saveLocalStorage(updatedList);
      return updatedList;
    });

    this.closeForm();
  }

  openDelete(item: any) {
    this.selectedProduct.set(item);
    this.isDeleteOpen.set(true);
  }

  confirmDelete() {
    const product = this.selectedProduct();
    if (!product) return;

    this.allProducts.update(list => {
      const updatedList = list.filter(p => p.id !== product.id);
      this.saveLocalStorage(updatedList);
      return updatedList;
    });

    this.isDeleteOpen.set(false);
  }

  private saveLocalStorage(data: any[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  }

  private loadProducts() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.allProducts.set(JSON.parse(stored));
      } else {
        const initialMock = [
          { id: 1, name: 'Men Grey Hoodie', categoryName: 'Hoodies', price: 49.90, quantity: 96, color: 'Black', tags: ['Hoodie'], categories: { Hoodie: true } },
          { id: 2, name: 'Woman Striped T-Shirt', categoryName: 'T-Shirt', price: 34.80, quantity: 56, color: 'White', tags: ['T-Shirt'], categories: { 'T-Shirt': true } },
          { id: 3, name: 'Women White T-Shirt', categoryName: 'T-Shirt', price: 40.90, quantity: 0, color: 'White', tags: ['T-Shirt'], categories: { 'T-Shirt': true } }
        ];
        this.allProducts.set(initialMock);
        this.saveLocalStorage(initialMock);
      }
    }
  }
}