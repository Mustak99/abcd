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
        [ngStyle]="{ color: toggle ? 'black' : '#978da8' }"
      >
        Add Manager
      </p>
      <p
        class="pl-1 mb-0 cursor"
        (click)="onof(false); fetchManager(masterId)"
        [ngStyle]="{ color: !toggle ? 'black' : '#978da8' }"
      >
        View Managers
      </p>
    </div>
    <div class="container-fluid mt-3 " *ngIf="toggle">
      <div class="card p-3 w-50 m-auto">
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
            <div
              *ngIf="
                managerForm.get('managerName')?.invalid &&
                managerForm.get('managerName')?.touched
              "
              class="error"
            >
              <div
                *ngIf="
                  managerForm
                    .get('managerName')
                    ?.errors?.hasOwnProperty('required')
                "
              >
                Manager Name is required.
              </div>
              <div
                *ngIf="
                  managerForm
                    .get('managerName')
                    ?.errors?.hasOwnProperty('pattern')
                "
              >
                Invalid name format.
              </div>
            </div>
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
            <div
              *ngIf="
                managerForm.get('managerEmail')?.invalid &&
                managerForm.get('managerEmail')?.touched
              "
              class="error"
            >
              <div
                *ngIf="
                  managerForm
                    .get('managerEmail')
                    ?.errors?.hasOwnProperty('required')
                "
              >
                Email is required.
              </div>
              <div
                *ngIf="
                  managerForm
                    .get('managerEmail')
                    ?.errors?.hasOwnProperty('email')
                "
              >
                Please enter a valid email address.
              </div>
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
            <div
              *ngIf="
                managerForm.get('managerPassword')?.invalid &&
                managerForm.get('managerPassword')?.touched
              "
              class="error"
            >
              <div
                *ngIf="
                  managerForm
                    .get('managerPassword')
                    ?.errors?.hasOwnProperty('required')
                "
              >
                Password is required.
              </div>
              <div
                *ngIf="
                  managerForm
                    .get('managerPassword')
                    ?.errors?.hasOwnProperty('minlength')
                "
              >
                Password must be at least 6 characters long.
              </div>
              <div
                *ngIf="
                  managerForm
                    .get('managerPassword')
                    ?.errors?.hasOwnProperty('pattern')
                "
              >
                Password must contain at least one uppercase letter, one
                lowercase letter, one number, and one special character.
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Enroll Manager</button>
        </form>
      </div>
    </div>
    <div class="container-fluid mx-auto mt-3" *ngIf="!toggle">
      <div class="card p-2">
        <h2 class="mb-4">Manager Information</h2>
        <div class="row">
          <div class="col-md-4" *ngFor="let manager of managerData">
            <div class="card manager-card">
              <div class="card-body">
                <h5 class="card-title" style="border-bottom:solid 1px">
                  {{ manager.name }}
                </h5>
                <p class="card-text">Email: {{ manager.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .manager-card {
        margin-bottom: 20px;
      }
      .error{
        color:red;
        font-size:10px;
      }
    `,
  ],
})
export class ManagerFormComponent {
  managerForm: FormGroup;
  masterId: any;
  toggle = true;
  managerData: any;
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private fb: FormBuilder,
    private authservice: AuthService
  ) {
    this.managerForm = this.fb.group({
      managerName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
      ],
      managerEmail: ['', [Validators.required, Validators.email]],
      managerPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
          ),
        ],
      ],
    });
  }

  ngOnInit() {
    this.masterId = sessionStorage.getItem('user_id');
    this.fetchManager(this.masterId);
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
              this.managerForm.reset();
              alert('Data added successfully');
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

  async fetchManager(masterId: string) {
    try {
      const snapshot = await this.firestore
        .collection('managers', (ref) => ref.where('master_id', '==', masterId))
        .get()
        .toPromise();

      if (snapshot && !snapshot.empty) {
        // Check if snapshot exists and is not empty
        const data = snapshot.docs.map((doc: any) => doc.data());
        this.managerData = data;
        console.log(this.managerData);
      } else {
        this.managerData = [];
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      this.managerData = [];
    }
  }
}
