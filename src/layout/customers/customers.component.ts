import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  isVip: boolean;
  image: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
  searchQuery = signal<string>('');
  currentFilter = signal<'all' | 'vip'>('all');

  customers = signal<Customer[]>([
    { id: '#CST881', name: 'Mohamed Hossam', email: 'mohamed@example.com', phone: '+20 123 456 789', status: 'Active', isVip: true, image: '' },
    { id: '#CST402', name: 'Ahmed Abdo', email: 'ahmed.abdo@example.com', phone: '+20 100 987 654', status: 'Active', isVip: false, image: '' },
    { id: '#CST109', name: 'Sarah El-Din', email: 'sarah.d@example.com', phone: '+20 111 222 333', status: 'Inactive', isVip: true, image: '' }
  ]);

  isCreateOpen = signal<boolean>(false);
  isDeleteOpen = signal<boolean>(false);
  selectedCustomer = signal<Customer | null>(null);

  customerForm = signal({
    name: '',
    email: '',
    phone: '',
    status: 'Active' as 'Active' | 'Inactive',
    isVip: false,
    image: ''
  });

  filteredCustomers = computed(() => {
    let list = this.customers();
    
    if (this.currentFilter() === 'vip') {
      list = list.filter(c => c.isVip);
    }

    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return list;
    
    return list.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.email.toLowerCase().includes(query) || 
      c.id.toLowerCase().includes(query)
    );
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.customerForm.update(form => ({ ...form, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  toggleVip(id: string) {
    this.customers.update(list => list.map(c => 
      c.id === id ? { ...c, isVip: !c.isVip } : c
    ));
  }

  openCreate() {
    this.customerForm.set({ name: '', email: '', phone: '', status: 'Active', isVip: false, image: '' });
    this.isCreateOpen.set(true);
  }

  saveCustomer() {
    const form = this.customerForm();
    if (form.name.trim() && form.email.trim()) {
      const newId = '#CST' + Math.floor(100 + Math.random() * 900);
      const newCust: Customer = {
        id: newId,
        name: form.name,
        email: form.email,
        phone: form.phone || 'N/A',
        status: form.status,
        isVip: form.isVip,
        image: form.image
      };
      this.customers.update(list => [newCust, ...list]);
      this.isCreateOpen.set(false);
    }
  }

  openDelete(customer: Customer) {
    this.selectedCustomer.set(customer);
    this.isDeleteOpen.set(true);
  }

  // ✅ الاسم هنا مطابق تماماً للـ HTML الآن لمنع خطأ الـ Compiler
  confirmDelete() {
    const current = this.selectedCustomer();
    if (current) {
      this.customers.update(list => list.filter(c => c.id !== current.id));
      this.isDeleteOpen.set(false);
    }
  }
}