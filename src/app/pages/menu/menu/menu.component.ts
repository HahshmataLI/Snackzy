import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { Item } from '../../../core/shared/model/item.model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { AddItemComponent } from "../add-item/add-item.component";
import { CategoryComponent } from "../category/category.component";
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
@Component({
  selector: 'app-menu',
  imports: [TableModule, CommonModule,ButtonModule,IconFieldModule, AddItemComponent, CategoryComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent  implements OnInit   {
  items: Item[] = [];
  showAddItem = false;
  showAddCategory = false;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getItems().subscribe((data) => (this.items = data));
  }

  deleteItem(id: string) {
    if (confirm('Are you sure?')) {
      this.menuService.deleteItem(id).subscribe(() => {
        this.items = this.items.filter((i) => i._id !== id);
      });
    }
  }

  toggleAddItem() {
    this.showAddItem = !this.showAddItem;
    this.showAddCategory = false; // close category form if open
  }

  toggleAddCategory() {
    this.showAddCategory = !this.showAddCategory;
    this.showAddItem = false; // close item form if open
  }
}