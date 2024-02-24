import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  username: string = '';


  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private Auth: AuthService
  ) {}

  submit() {
    this.Auth.register(this.email, this.password, this.username)
  }
  
}
