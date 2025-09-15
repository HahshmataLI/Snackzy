import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/shared/model/order.model';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-list',
  imports: [FormsModule,CommonModule, ConfirmDialogModule,TableModule,ButtonModule,DropdownModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css',
  providers: [ConfirmationService] 
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  constructor(
    private orderService: OrderService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }
printInvoice(order: Order): void {
  const win = window.open('', '_blank');
  if (!win) return;

  const itemLines = order.items
    .map(i => `<li>${i.item.name} x ${i.quantity} = ${i.item.price * i.quantity} Rs</li>`)
    .join('');

  const html = `
    <html>
    <head>
      <title>Invoice - ${order._id}</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h2 { border-bottom: 1px solid #ccc; }
        ul { padding-left: 20px; }
        .total { font-size: 1.2rem; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h2>🧾 Order Invoice</h2>
      <p><strong>Customer:</strong> ${order.createdBy.name} (${order.createdBy.email})</p>
      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>

      <ul>${itemLines}</ul>

      <p class="total">Total: ${order.total.toFixed(2)} Rs</p>
    </body>
    </html>
  `;

  win.document.write(html);
  win.document.close();
  win.print();
}

  fetchOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: () => {
        alert('Failed to fetch orders');
        this.loading = false;
      }
    });
  }

  updateStatus(orderId: string, status: Order['status']): void {
    this.orderService.updateStatus(orderId, status).subscribe({
      next: () => {
        this.fetchOrders(); // reload list
      },
      error: () => alert('Failed to update status')
    });
  }

  confirmDelete(orderId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this order?',
      accept: () => this.deleteOrder(orderId)
    });
  }

  deleteOrder(orderId: string): void {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o._id !== orderId);
      },
      error: () => alert('Delete failed')
    });
  }
}