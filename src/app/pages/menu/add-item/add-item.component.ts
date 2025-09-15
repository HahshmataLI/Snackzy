import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { Category } from '../../../core/shared/model/category.model';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-item',
  imports: [CommonModule,ReactiveFormsModule,DropdownModule,FormsModule,InputTextModule,ButtonModule,CheckboxModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent  implements OnInit {
  itemForm!: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: [''],
      category: ['', Validators.required],
      available: [true]
    });

    this.menuService.getCategories().subscribe(res => this.categories = res);
  }

  submit() {
  if (this.itemForm.invalid) return;

  const formData = new FormData();
  const raw = this.itemForm.value;

  formData.append('name', raw.name);
  formData.append('price', raw.price.toString());
  formData.append('category', raw.category);
  formData.append('available', raw.available.toString());

  if (raw.image instanceof File) {
    formData.append('image', raw.image);
  }

  this.menuService.addItem(formData).subscribe({
    next: () => {
      alert('Item added successfully');
      this.itemForm.reset({ available: true });
    },
    error: err => {
      alert(err.error.message || 'Error occurred');
    }
  });
}

onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.itemForm.patchValue({ image: file });
  }
}

}