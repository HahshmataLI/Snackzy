import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { OrdersComponent } from './pages/orders/orders/orders.component';
import { MenuComponent } from './pages/menu/menu/menu.component';
import { CreateOrderComponent } from './pages/orders/create-order/create-order.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, adminGuard], // ✅ Only admins allowed
  },
  {
    path: 'list-orders',
    component: OrdersListComponent,
    canActivate: [AuthGuard, adminGuard], // ✅ Only admins allowed
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/create',
    component: CreateOrderComponent,
    canActivate: [AuthGuard], // or restrict to cashiers if needed
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuard, adminGuard],
  },
  {
    path: 'menu/items',
    component: MenuComponent,
    canActivate: [AuthGuard, adminGuard],
  },
];
