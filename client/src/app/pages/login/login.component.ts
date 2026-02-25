import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = '';
  password = '';
  success = '';
  error = '';
  loading = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.success = '';
    this.error = '';
    this.loading = true;
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        const token = (res as any).token ?? (res as any).accessToken ?? null;
        if (token) {
          this.auth.setToken(token);
          console.log('JWT token after login:', token);
          this.success = 'Login successful';
          this.router.navigate(['/'], { state: { refreshTodos: true } });
        } else {
          this.error = 'Login succeeded but no token returned';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Login failed';
      }
    });
  }
}