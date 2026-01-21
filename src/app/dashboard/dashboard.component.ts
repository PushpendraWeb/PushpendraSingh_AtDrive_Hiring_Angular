import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { WeatherComponent } from '../weather/weather.component';
import { BaseService } from '../service/BaseService.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, WeatherComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  productCount = 0;
  orderCount = 0;

  constructor(private baseService: BaseService, private router: Router) {}

  ngOnInit(): void {
    this.baseService.validateToken().subscribe({
      next: () => this.loadCounts(),
      error: () => this.baseService.Logout(),
    });
  }

  loadCounts() {
    this.baseService.getAllProducts().subscribe({
      next: (res) => {
        const items = res?.data ?? res ?? [];
        this.productCount = Array.isArray(items) ? items.length : 0;
      },
      error: () => {
        this.productCount = 0;
      },
    });

    this.baseService.getAllOrders().subscribe({
      next: (res) => {
        const items = res?.data ?? res ?? [];
        this.orderCount = Array.isArray(items) ? items.length : 0;
      },
      error: () => {
        this.orderCount = 0;
      },
    });
  }

  logout() {
    this.baseService.Logout();
  }
}
