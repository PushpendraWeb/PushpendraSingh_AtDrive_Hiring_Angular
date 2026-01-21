import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';
import { BaseService } from '../service/BaseService.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';

  signUpName = '';
  signUpUsername = '';
  signUpPassword = '';
  showSignUp = false;

  constructor(
    private baseService: BaseService,
    private toast: ToastService,
    private router: Router
  ) {}

  openSignUp() {
    this.showSignUp = true;
  }

  openLogin() {
    this.showSignUp = false;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.username || !this.password) {
      this.toast.error('Please enter username and password');
      return;
    }

    this.baseService.Login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.toast.success('Logged in successfully');
        if (res) {
          localStorage.setItem('AuthData', JSON.stringify(res.token));
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          err?.error?.error ||
          'Login failed. Please check your username and password.';
        this.toast.error(msg);
      },
    });
  }

  onSignUp(event: Event) {
    event.preventDefault();

    if (!this.signUpName || !this.signUpUsername || !this.signUpPassword) {
      this.toast.error('Please fill all sign up fields');
      return;
    }

    this.baseService
      .Register({
        name: this.signUpName,
        username: this.signUpUsername,
        password: this.signUpPassword,
        status: true,
      })
      .subscribe({
        next: () => {
          this.toast.success('Account created successfully. You can now sign in.');
          // copy username/password into login fields for convenience
          this.username = this.signUpUsername;
          this.password = this.signUpPassword;
        },
        error: (err) => {
          const msg =
            err?.error?.message ||
            err?.error?.error ||
            'Sign up failed. Please try again.';
          this.toast.error(msg);
        },
      });
  }
}
