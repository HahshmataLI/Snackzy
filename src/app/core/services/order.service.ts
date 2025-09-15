import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants';
import { Order } from '../shared/model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService  {
  private apiUrl = `${API_BASE_URL}/orders`;

  constructor(private http: HttpClient) {}

  // ✅ Create new order
  createOrder(payload: Pick<Order, 'paymentMethod' | 'total'> & {
    items: { item: string; quantity: number }[];
  }): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, payload);
  }

  // ✅ Get orders created by logged-in cashier
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`);
  }

  // ✅ Admin: Get all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  // ✅ Admin: Update order status
  updateStatus(id: string, status: Order['status']): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { status });
  }

  // ✅ Admin: Delete an order
  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}