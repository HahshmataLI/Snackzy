import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  imports: [DropdownModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = '';

  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Cashier', value: 'cashier' }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.register({ name: this.name, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: () => {
          alert('Registered successfully!');
          this.router.navigate(['/login']);
        },
        error: err => {
          alert(err.error.message || 'Registration failed');
        }
      });
  }
}