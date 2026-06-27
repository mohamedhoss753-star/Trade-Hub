import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseApiService {

  // Get all orders
  getOrders(): Observable<any> {
    return this.get<any>('Orders');
  }

  // Get order by id
  getOrderById(id: number): Observable<any> {
    return this.get<any>(`Orders/${id}`);
  }

  // Cancel order
  cancelOrder(orderId: number): Observable<any> {
    return this.put<any>(`Orders/${orderId}/cancel`, {});
  }
}