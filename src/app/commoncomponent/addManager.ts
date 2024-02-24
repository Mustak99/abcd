import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-manager-form',
  template: `
    <form [formGroup]="managerForm" (ngSubmit)="enrollManager()">
      <label for="managerName">Manager Name:</label>
      <input type="text" id="managerName" formControlName="managerName"><br>
      <label for="managerEmail">Manager Email:</label>
      <input type="email" id="managerEmail" formControlName="managerEmail"><br>
      <label for="managerPassword">Password:</label>
      <input type="password" id="managerPassword" formControlName="managerPassword"><br>
      <button type="submit" [disabled]="managerForm.invalid">Enroll Manager</button>
    </form>
  `,
  styles: [``],
})
export class ManagerFormComponent {
  managerForm: FormGroup;
  masterId :any;
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private fb: FormBuilder,
    private authservice:AuthService
  ) {
    this.managerForm = this.fb.group({
      managerName: ['', Validators.required],
      managerEmail: ['', [Validators.required, Validators.email]],
      managerPassword: ['', [Validators.required, Validators.minLength(6)]], // Adjust minimum password length as per your requirements
    });
  }

  ngOnInit(){
    this.masterId= localStorage.getItem('user_id');
  }

  enrollManager() {
    if (this.managerForm.valid) {
      const { managerEmail, managerPassword, managerName } = this.managerForm.value;
  
      this.auth.createUserWithEmailAndPassword(managerEmail, managerPassword)
        .then(async (userCredential) => {
          const user = userCredential.user;
          if (user) {
            const managerData = {
              name: managerName,
              email: managerEmail,
              password: managerPassword,
              master_id: this.masterId 
            };
            try {
              await user.updateProfile({
                displayName: managerName,
              });
              await this.firestore.collection('managers').doc(user.uid).set(managerData);
              console.log('Manager enrolled with ID: ', user.uid);
            } catch (error) {
              console.error('Error enrolling manager: ', error);
            }
          } else {
            console.error('User is null.');
          }
        })
        .catch((error) => {
          console.error('Error creating manager account: ', error);
        });
    } 
  }
  
}
