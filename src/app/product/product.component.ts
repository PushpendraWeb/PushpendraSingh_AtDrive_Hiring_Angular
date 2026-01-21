import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BaseService } from '../service/BaseService.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  loading = false;

  formModel: any = {
    id: null,
    name: '',
    price: null,
    description: '',
    status: true,
  };

  constructor(private baseService: BaseService, private toast: ToastService) {}

  ngOnInit(): void {
    this.baseService.validateToken().subscribe({
      next: () => this.loadProducts(),
      error: () => {
        this.toast.error('Session expired, please log in again.');
        this.baseService.Logout();
      },
    });
  }

  loadProducts() {
    this.loading = true;
    this.baseService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res?.data ?? res ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load products');
      },
    });
  }

  edit(product: any) {
    this.formModel = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      status: product.status,
    };
  }

  resetForm() {
    this.formModel = {
      id: null,
      name: '',
      price: null,
      description: '',
      status: true,
    };
  }

  submit() {
    if (!this.formModel.name || this.formModel.price == null) {
      this.toast.error('Name and price are required');
      return;
    }

    const payload = {
      name: this.formModel.name,
      price: Number(this.formModel.price),
      description: this.formModel.description,
      status: this.formModel.status,
    };

    if (this.formModel.id) {
      this.baseService.updateProduct(this.formModel.id, payload).subscribe({
        next: () => {
          this.toast.success('Product updated');
          this.resetForm();
          this.loadProducts();
        },
        error: () => this.toast.error('Failed to update product'),
      });
    } else {
      this.baseService.createProduct(payload).subscribe({
        next: () => {
          this.toast.success('Product created');
          this.resetForm();
          this.loadProducts();
        },
        error: () => this.toast.error('Failed to create product'),
      });
    }
  }

  delete(product: any) {
    if (!product?.id) {
      return;
    }
    this.baseService.deleteProduct(product.id).subscribe({
      next: () => {
        this.toast.success('Product deleted');
        this.loadProducts();
      },
      error: () => this.toast.error('Failed to delete product'),
    });
  }
}
