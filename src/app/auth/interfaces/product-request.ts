// 1. المحدادات الخاصة بطلب جلب المنتجات (GET /api/Product)
export interface ProductQueryParams {
  categoryId?: number;
  CompanyId?: string;
  Sort?: string;
  Search?: string;
  PageSize?: number;
  pageIndex?: number;
}

// 2. الحقول المطلوبة لإنشاء منتج جديد (POST /api/Product)
export interface CreateProductRequest {
  name: string;
  price: number;
  quantity: number;
  companyId: string;
  categoryId: number;
  image?: File | null; // بيتبعت كـ string($binary) في الـ multipart/form-data
  attributes?: any[];
}

// 3. الحقول المطلوبة لتعديل منتج (PUT /api/Product)
export interface UpdateProductRequest {
  id: number; // بيمر كـ Query Parameter في الـ URL للـ PUT
  companyId?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  imageUrl?: File | null; // بيتبعت كـ string($binary) في الـ multipart/form-data للتعديل
  categoryId?: number;
  isActive?: boolean;
}