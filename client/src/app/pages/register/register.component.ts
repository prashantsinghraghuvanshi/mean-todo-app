import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  onRegister() {
    console.log('Register Data:', this.name, this.email, this.password);
  }
}