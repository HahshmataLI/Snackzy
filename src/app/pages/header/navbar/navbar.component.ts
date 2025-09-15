import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router ,RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink,MenubarModule,SidebarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class  NavbarComponent {
  sidebarVisible = false;

  constructor(public authService: AuthService) {}
closeSidebar() {
  this.sidebarVisible = false;
}
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onLogout() {
    this.authService.logout();
  }

  get user() {
    return this.authService.getUser();
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}