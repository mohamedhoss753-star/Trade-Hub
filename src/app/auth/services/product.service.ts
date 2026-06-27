import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Product, ProductResponse, ProductQueryParams } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseApiService {

  // 1. GET ALL PRODUCTS
  getProducts(params?: ProductQueryParams): Observable<ProductResponse> {
    return this.get<ProductResponse>('Product', params);
  }

  // 2. GET PRODUCT BY ID
  getProductById(id: number): Observable<Product> {
    return this.get<Product>(`Product/${id}`);
  }

  // 3. POST / CREATE PRODUCT
  createProduct(formData: FormData): Observable<any> {
    return this.post<any>('Product', formData);
  }

  // 4. PUT / UPDATE PRODUCT
  updateProduct(id: number, formData: FormData): Observable<boolean> {
    return this.put<boolean>(`Product?id=${id}`, formData);
  }

  // 5. DELETE PRODUCT (التي كانت ناقصة وأعطت خطأ)
  deleteProduct(id: number): Observable<boolean> {
    return this.delete<boolean>(`Product?id=${id}`);
  }
}