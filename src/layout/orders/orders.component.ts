import {
  Component,
  signal,
  computed,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../app/auth/services/order.service';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  selected: boolean;
}

interface Order {
  id: number;

  companyName?: string;
  address?: string;

  orderStatus?: string;
  paymentStatus?: string;

  createdAt?: string;

  total?: number;

  items?: any[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  private orderService = inject(OrderService);

  order: Order | null = null;

  orderStatus = signal<string>('Pending');
  showCustomerDetails = signal<boolean>(false);

  products = signal<OrderItem[]>([]);

  // subtotal
  subtotal = computed(() => {
    return this.products().reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  });

  // tax
  tax = computed(() => this.subtotal() * 0.20);

  // total
  total = computed(() => this.subtotal() + this.tax());

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {

    this.orderService.getOrderById(1).subscribe({

      next: (res: Order) => {

        console.log('Order =>', res);

        this.order = res;

        this.orderStatus.set(res.orderStatus || 'Pending');

        if (res.items?.length) {

          const mapped: OrderItem[] = res.items.map((item: any) => ({
            id: item.productId?.toString() || '',
            name: item.productName || '',
            quantity: item.quantity || 1,
            price: item.price || 0,
            selected: false
          }));

          this.products.set(mapped);

        } else {
          this.products.set([]);
        }
      },

      error: (err) => {
        console.error('Order Error =>', err);
      }

    });
  }

  updateStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.orderStatus.set(value);
  }

  toggleCustomerView(): void {
    this.showCustomerDetails.set(!this.showCustomerDetails());
  }

  updateQuantity(id: string, change: number): void {

    this.products.update(items =>
      items.map(item => {

        if (item.id === id) {
          const newQty = item.quantity + change;

          return {
            ...item,
            quantity: newQty > 0 ? newQty : 1
          };
        }

        return item;
      })
    );
  }

  toggleAllItems(event: Event): void {

    const checked = (event.target as HTMLInputElement).checked;

    this.products.update(items =>
      items.map(item => ({
        ...item,
        selected: checked
      }))
    );
  }

  printInvoice(): void {
    window.print();
  }

  cancelOrder(): void {

    if (!this.order?.id) return;

    this.orderService.cancelOrder(this.order.id).subscribe({

      next: () => {
        alert('Order Cancelled');
        this.orderStatus.set('Cancelled');
      },

      error: (err) => {
        console.error('Cancel Error =>', err);
      }

    });
  }

  saveOrder(): void {
    alert('Status: ' + this.orderStatus());
  }
}