import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    try {
      await this.authService.register(this.email, this.password, this.username);

      // Redirect to a success page or navigate to another route
      this.router.navigate(['/login']);
    } catch (error) {
      // Handle error appropriately (show a message, etc.)
      console.error('Error during registration:', error);
    }
  }
}
