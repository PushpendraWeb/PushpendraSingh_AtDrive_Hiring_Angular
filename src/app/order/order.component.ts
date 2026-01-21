import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BaseService } from '../service/BaseService.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  products: any[] = [];
  loading = false;
  loadingProducts = false;

  orderItems: { product_id: number; quantity: number; productName?: string }[] = [];
  selectedProductId: number | null = null;
  selectedQuantity: number = 1;
  editingOrderId: number | null = null;

  constructor(private baseService: BaseService, private toast: ToastService) {}

  ngOnInit(): void {
    this.baseService.validateToken().subscribe({
      next: () => {
        this.loadProducts();
        this.loadOrders();
      },
      error: () => {
        this.toast.error('Session expired, please log in again.');
        this.baseService.Logout();
      },
    });
  }

  loadProducts() {
    this.loadingProducts = true;
    this.baseService.getAllProducts().subscribe({
      next: (res) => {
        const items = res?.data ?? res ?? [];
        // Normalize product id into _uiId to handle different backend id field names
        this.products = (items || []).map((p: any) => ({
          ...p,
          _uiId: p.id ?? p.product_id ?? p._id,
        }));
        this.loadingProducts = false;
      },
      error: () => {
        this.loadingProducts = false;
        this.toast.error('Failed to load products');
      },
    });
  }

  loadOrders() {
    this.loading = true;
    this.baseService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res?.data ?? res ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load orders');
      },
    });
  }

  addItem() {
    if (!this.selectedProductId || this.selectedQuantity < 1) {
      this.toast.error('Please select a product and enter quantity');
      return;
    }
    

    const productId = this.selectedProductId;
    if (!productId) {
      this.toast.error('Product not found');
      return;
    }
    const productBackendId = productId;

    // Check if product already added
    const existingIndex = this.orderItems.findIndex(
      (item) => item.product_id === productBackendId
    );

    if (existingIndex >= 0) {
      // Update quantity if already exists
      this.orderItems[existingIndex].quantity += this.selectedQuantity;
    } else {
      // Add new item
    this.baseService.getProductById(productBackendId).subscribe({
      next: (res) => {
        const product = res?.data ?? res ?? [];
        this.orderItems.push({
          product_id: productBackendId,
          quantity: this.selectedQuantity,
          productName: product.name,
        });
      },
      error: () => {
        this.toast.error('Failed to get product');
        return;
      },
    });
    }

    // Reset form
    this.selectedProductId = null;
    this.selectedQuantity = 1;
  }

  removeItem(index: number) {
    this.orderItems.splice(index, 1);
  }

  createOrder() {
    if (this.orderItems.length === 0) {
      this.toast.error('Please add at least one product to the order');
      return;
    }

    const body = {
      products: this.orderItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    const isEdit = this.editingOrderId != null;
    const request$ = isEdit
      ? this.baseService.updateOrder(this.editingOrderId!, body)
      : this.baseService.createOrder(body);

    request$.subscribe({
      next: () => {
        this.toast.success(isEdit ? 'Order updated' : 'Order created');
        this.orderItems = [];
        this.selectedProductId = null;
        this.selectedQuantity = 1;
        this.editingOrderId = null;
        this.loadOrders();
      },
      error: () => this.toast.error(isEdit ? 'Failed to update order' : 'Failed to create order'),
    });
  }

  viewOrder(order: any) {
    // Simple view: log to console; can be replaced by modal later
    console.log('Order details:', order);
    this.toast.success(`Viewing order #${order.id}`);
  }

  editOrder(order: any) {
    if (!order?.id || !order?.products?.length) {
      this.toast.error('This order has no editable products');
      return;
    }
    this.editingOrderId = order.id;
    this.orderItems = order.products.map((p: any) => ({
      product_id: p.product_id ?? p.id ?? p._id,
      quantity: p.quantity ?? p.qty ?? 1,
      productName:
        p.product?.name ||
        p.name ||
        `Product ${p.product_id ?? p.id ?? p._id}`,
    }));
    this.toast.success(`Editing order #${order.id}`);
  }

  deleteOrder(order: any) {
    if (!order?.id) {
      return;
    }
    this.baseService.deleteOrder(order.id).subscribe({
      next: () => {
        this.toast.success('Order deleted');
        this.loadOrders();
      },
      error: () => this.toast.error('Failed to delete order'),
    });
  }
}
