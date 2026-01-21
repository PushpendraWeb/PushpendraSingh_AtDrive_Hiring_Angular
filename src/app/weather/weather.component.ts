import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BaseService } from '../service/BaseService.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css',
})
export class WeatherComponent implements OnInit {
  city = 'London';
  loading = false;
  weather: any = null;

  constructor(private baseService: BaseService, private toast: ToastService) {}

  ngOnInit(): void {
    this.baseService.validateToken().subscribe({
      next: () => this.loadWeather(),
      error: () => {
        this.toast.error('Session expired, please log in again.');
        this.baseService.Logout();
      },
    });
  }

  loadWeather() {
    if (!this.city) {
      this.toast.error('Please enter a city');
      return;
    }
    this.loading = true;
    this.baseService.getCurrentWeather(this.city).subscribe({
      next: (res) => {
        this.weather = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load weather');
      },
    });
  }
}
