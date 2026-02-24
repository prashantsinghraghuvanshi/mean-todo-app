import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  name = '';
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

  onRegister() {
    this.success = '';
    this.error = '';
    this.loading = true;
    this.api.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        const token = (res as any).token ?? (res as any).accessToken ?? null;
        if (token) {
          this.auth.setToken(token);
          this.success = 'Registration successful';
          this.router.navigate(['/']);
        } else {
          this.success = 'Registration successful — please log in';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Registration failed';
      }
    });
  }
}