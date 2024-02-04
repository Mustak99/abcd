import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { DataretriveService } from 'src/app/service/dataretrive.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router,private dataRetrive :DataretriveService) {}

   onSubmit() {
     this.authService.login(this.email, this.password)
  }
}
