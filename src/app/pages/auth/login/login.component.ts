import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,              // ✅ ENABLES ngModel
    HttpClientModule,         // ✅ Enables HTTP requests
    ButtonModule,             // ✅ PrimeNG
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        const role = res?.user?.role;

        if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'cashier') {
          this.router.navigate(['/orders']);
        } else {
          alert('Unknown role, access denied.');
        }

        this.loading = false;
      },
      error: (err) => {
        alert(err?.error?.message || 'Login failed');
        this.loading = false;
      }
    });
  }
}