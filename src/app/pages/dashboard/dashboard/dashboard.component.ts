import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { OrderService } from '../../../core/services/order.service';
import { MenuService } from '../../../core/services/menu.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/shared/model/order.model';
import { Item } from '../../../core/shared/model/item.model';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ChartModule,
    TableModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loading = true;

  orders: Order[] = [];
  items: Item[] = [];

  // KPI numbers
  totalSalesToday = 0;
  totalSalesWeek = 0;
  totalSalesMonth = 0;
  ordersCountToday = 0;
  avgOrderValue = 0;

  // Charts data
  salesLineData: any;
  paymentDoughnutData: any;
  topItemsBarData: any;

  topItemsList: { id: string; name: string; qty: number; revenue: number }[] = [];
  recentOrders: Order[] = [];
getStock(item: any): number {
  return item?.stock ?? 0;
}

  // low stock support - only if item has 'stock' property
  lowStockItems: Item[] = [];
  lowStockSupported = false;

  // currency formatter (PKR as default)
  nf = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' });

  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const orders$ = this.auth.isAdmin() ? this.orderService.getAllOrders() : this.orderService.getMyOrders();
    const items$ = this.menuService.getItems();

    forkJoin([orders$, items$])
      .pipe(
        finalize(() => (this.loading = false)),
        catchError(err => {
          console.error('Dashboard load error', err);
          return of([[], []]);
        })
      )
      .subscribe((res: any) => {
        const [orders, items] = res;
        this.orders = orders || [];
        this.items = items || [];

        this.lowStockSupported = this.items.some((i: any) => i && typeof (i as any).stock !== 'undefined');
        if (this.lowStockSupported) {
          // threshold 5 (example)
          this.lowStockItems = this.items.filter((i: any) => (i as any).stock <= 5);
        }

        this.computeKPIs();
      });
  }

  private computeKPIs() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - 6); // last 7 days inclusive
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalAllOrders = 0;
    let ordersCountAll = this.orders.length;

    // Prepare daily buckets for last 7 days
    const dailyLabels: string[] = [];
    const dailyTotals: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(startOfToday);
      dt.setDate(startOfToday.getDate() - i);
      dailyLabels.push(dt.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })); // e.g. "15 Sep"
      dailyTotals.push(0);
    }

    const paymentSums = { cash: 0, card: 0 };
    const itemMap = new Map<string, { name: string; qty: number; revenue: number }>();

    this.orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const orderTotal = Number(order.total) || 0;
      totalAllOrders += orderTotal;

      // Today
      if (orderDate >= startOfToday) {
        this.totalSalesToday += orderTotal;
        this.ordersCountToday += 1;
      }

      // This week (last 7 days)
      if (orderDate >= startOfWeek) {
        this.totalSalesWeek += orderTotal;

        // map to daily bucket
        const dayDiff = Math.floor((orderDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
        const idx = Math.min(Math.max(dayDiff, 0), 6); // 0..6
        dailyTotals[idx] += orderTotal;
      }

      // This month
      if (orderDate >= startOfMonth) {
        this.totalSalesMonth += orderTotal;
      }

      // Payment breakdown
      if (order.paymentMethod === 'cash') paymentSums.cash += orderTotal;
      else paymentSums.card += orderTotal;

      // Items
      order.items.forEach(it => {
        const id = it.item._id;
        const name = it.item.name;
        const qty = it.quantity || 0;
        const revenue = (it.item.price || 0) * qty;
        if (!itemMap.has(id)) itemMap.set(id, { name, qty: 0, revenue: 0 });
        const cur = itemMap.get(id)!;
        cur.qty += qty;
        cur.revenue += revenue;
      });
    });

    // average order (global). You can change to 'today' or 'week' as required.
    this.avgOrderValue = ordersCountAll > 0 ? totalAllOrders / ordersCountAll : 0;

    // top items
    const itemsArray = Array.from(itemMap.entries()).map(([id, v]) => ({ id, ...v }));
    itemsArray.sort((a, b) => b.qty - a.qty);
    this.topItemsList = itemsArray.slice(0, 5);

    // prepare chart objects for PrimeNG (Chart.js format)
    this.salesLineData = {
      labels: dailyLabels,
      datasets: [
        {
          label: 'Sales',
          data: dailyTotals,
          fill: false,
          tension: 0.3
        }
      ]
    };

    this.paymentDoughnutData = {
      labels: ['Cash', 'Card'],
      datasets: [{ data: [paymentSums.cash, paymentSums.card] }]
    };

    this.topItemsBarData = {
      labels: this.topItemsList.map(t => t.name),
      datasets: [{ label: 'Quantity sold', data: this.topItemsList.map(t => t.qty) }]
    };

    // recent orders (sorted desc)
    this.recentOrders = [...this.orders].sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())).slice(0, 10);

    // format numbers e.g. you can use nf.format(x) in template
  }

  // utility to format currency
  formatCurrency(amount: number) {
    return this.nf.format(amount);
  }

  // quick refresh button
  onRefresh() {
    this.loadData();
  }
}