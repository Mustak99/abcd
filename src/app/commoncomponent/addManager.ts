import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-manager-form',
  template: `
    <div style="border-bottom:#978da8 solid 1px;display:flex;">
      <p
        class="mb-0 pr-1 cursor"
        (click)="onof(true)"
        [ngStyle]="{ 'color': toggle ? 'black' : '#978da8' }"
      >
        Add Manager
      </p>
      <p class="pl-1 mb-0 cursor" (click)="onof(false)"
      [ngStyle]="{ 'color': !toggle ? 'black' : '#978da8' }"
      >View Managers</p>
    </div>
    <div class="container-fluid" *ngIf="toggle">
      <form
        [formGroup]="managerForm"
        (ngSubmit)="enrollManager()"
        class="needs-validation"
        novalidate
      >
        <div class="form-group">
          <label for="managerName">Manager Name:</label>
          <input
            type="text"
            id="managerName"
            formControlName="managerName"
            class="form-control"
            required
          />
          <div class="invalid-feedback">Manager Name is required.</div>
        </div>

        <div class="form-group">
          <label for="managerEmail">Manager Email:</label>
          <input
            type="email"
            id="managerEmail"
            formControlName="managerEmail"
            class="form-control"
            required
          />
          <div class="invalid-feedback">
            Please enter a valid email address.
          </div>
        </div>

        <div class="form-group">
          <label for="managerPassword">Password:</label>
          <input
            type="password"
            id="managerPassword"
            formControlName="managerPassword"
            class="form-control"
            required
          />
          <div class="invalid-feedback">Password is required.</div>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="managerForm.invalid"
        >
          Enroll Manager
        </button>
      </form>
    </div>
  `,
  styles: [``],
})
export class ManagerFormComponent {
  managerForm: FormGroup;
  masterId: any;
  toggle = true;
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private fb: FormBuilder,
    private authservice: AuthService
  ) {
    this.managerForm = this.fb.group({
      managerName: ['', Validators.required],
      managerEmail: ['', [Validators.required, Validators.email]],
      managerPassword: ['', [Validators.required, Validators.minLength(6)]], // Adjust minimum password length as per your requirements
    });
  }

  ngOnInit() {
    this.masterId = sessionStorage.getItem('user_id');
  }

  onof(parametr: boolean) {
    this.toggle = parametr;
  }

  enrollManager() {
    if (this.managerForm.valid) {
      const { managerEmail, managerPassword, managerName } =
        this.managerForm.value;

      this.auth
        .createUserWithEmailAndPassword(managerEmail, managerPassword)
        .then(async (userCredential) => {
          const user = userCredential.user;
          if (user) {
            const managerData = {
              name: managerName,
              email: managerEmail,
              password: managerPassword,
              master_id: this.masterId,
            };
            try {
              await user.updateProfile({
                displayName: managerName,
              });
              await this.firestore
                .collection('managers')
                .doc(user.uid)
                .set(managerData);
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
