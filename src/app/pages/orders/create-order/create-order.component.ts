import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray, FormsModule, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuService } from '../../../core/services/menu.service';
import { OrderService } from '../../../core/services/order.service';
import { Item } from '../../../core/shared/model/item.model';

@Component({
  selector: 'app-create-order',
  imports: [CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ButtonModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {
  orderForm!: FormGroup;
  menuItems: Item[] = [];

  paymentOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'Card', value: 'card' }
  ];

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      items: this.fb.array([]),
      paymentMethod: ['', Validators.required]
    });

    this.menuService.getItems().subscribe((items) => (this.menuItems = items));
    this.addItem(); // Add first item by default
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  newItemGroup(): FormGroup {
    return this.fb.group({
      item: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addItem(): void {
    this.items.push(this.newItemGroup());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  get total(): number {
    return this.items.controls.reduce((sum, group) => {
      const itemId = group.get('item')?.value;
      const quantity = group.get('quantity')?.value;
      const item = this.menuItems.find(i => i._id === itemId);
      return item ? sum + item.price * quantity : sum;
    }, 0);
  }

  // ✅ Helper to cast AbstractControl to FormGroup
  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  // ✅ Helper to cast AbstractControl to FormControl
  asFormControl(control: AbstractControl | null): FormControl {
    return control as FormControl;
  }

  submit(): void {
    const payload = {
      items: this.items.value.map((i: any) => ({
        item: i.item,
        quantity: i.quantity
      })),
      paymentMethod: this.orderForm.value.paymentMethod,
      total: this.total
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        alert('✅ Order placed successfully');
        this.router.navigate(['/orders']);
      },
      error: err => {
        alert('❌ ' + (err?.error?.message || 'Order failed'));
      }
    });
  }
}