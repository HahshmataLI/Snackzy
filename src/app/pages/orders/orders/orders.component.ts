import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/shared/model/order.model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-orders',
  imports: [TableModule,CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent  implements OnInit {
  orders: Order[] = [];
  isAdmin = false;

  constructor(private auth: AuthService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();

    const fetch = this.isAdmin
      ? this.orderService.getAllOrders()
      : this.orderService.getMyOrders();

    fetch.subscribe(res => this.orders = res);
  }
}