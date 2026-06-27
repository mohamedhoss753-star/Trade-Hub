export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  subCategoryId?: number;
  subCategoryName?: string;
  companyId: string;
  companyName?: string;
  logoUrl?: string;
  categoryId: number;
  categoryName?: string;
  attributes?: any[];
  averageRating?: number;
  ratingCount?: number;
  isFavourite?: boolean;
  hasOffer?: boolean;
  discountPercentage?: number;
  offerStartDate?: string;
  offerEndDate?: string;
  finalPrice?: number;
  isOfferActive?: boolean;
}

// ضفنا دي هنا عشان الـ Service يشوفها فوراً
export interface ProductResponse {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Product[];
}

export interface ProductQueryParams {
  categoryId?: number;
  CompanyId?: string;
  Sort?: string;
  Search?: string;
  PageSize?: number;
  pageIndex?: number;
}