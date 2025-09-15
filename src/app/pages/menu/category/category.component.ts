import { Component } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  imports: [FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  name = '';
  loading = false;

  constructor(private menuService: MenuService) {}

  addCategory() {
    this.loading = true;
    this.menuService.addCategory({ name: this.name }).subscribe({
      next: () => {
        alert('Category added!');
        this.name = '';
        this.loading = false;
      },
      error: err => {
        alert('Error: ' + err?.error?.message || 'Failed');
        this.loading = false;
      }
    });
  }
}