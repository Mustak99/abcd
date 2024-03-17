import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-form',
  template: `
    <div class="container-fluid mt-3">
      <div class="card p-3 w-75 m-auto">
        <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="vendorName">Vendor Name:</label>
            <input
              type="text"
              id="vendorName"
              formControlName="vendorName"
              class="form-control"
              required
            />
            <div class="invalid-feedback" *ngIf="invoiceForm.controls['vendorName'].invalid && (invoiceForm.controls['vendorName'].dirty || invoiceForm.controls['vendorName'].touched)">
              Vendor Name is required.
            </div>
          </div>

          <div class="form-group">
            <label for="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              formControlName="quantity"
              class="form-control"
              required
            />
            <div class="invalid-feedback" *ngIf="invoiceForm.controls['quantity'].invalid && (invoiceForm.controls['quantity'].dirty || invoiceForm.controls['quantity'].touched)">
              Quantity is required.
            </div>
          </div>

          <div class="form-group">
            <label for="unitPrice">Unit Price:</label>
            <input
              type="number"
              id="unitPrice"
              formControlName="unitPrice"
              class="form-control"
              required
            />
            <div class="invalid-feedback" *ngIf="invoiceForm.controls['unitPrice'].invalid && (invoiceForm.controls['unitPrice'].dirty || invoiceForm.controls['unitPrice'].touched)">
              Unit Price is required.
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description:</label>
            <textarea
              id="description"
              formControlName="description"
              class="form-control"
              required
            ></textarea>
            <div class="invalid-feedback" *ngIf="invoiceForm.controls['description'].invalid && (invoiceForm.controls['description'].dirty || invoiceForm.controls['description'].touched)">
              Description is required.
            </div>
          </div>

          <input type="hidden" formControlName="sgstRate" value="9">
          <input type="hidden" formControlName="cgstRate" value="9">

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="invoiceForm.invalid"
          >
            Create Invoice
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      /* Add your styles here */
    `,
  ],
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm!: FormGroup;
  manager_id: any;
  master_id: any;

  constructor(private firestore: AngularFirestore, private fb: FormBuilder) {}

  ngOnInit() {
    this.manager_id = sessionStorage.getItem('manager_id');
    this.getMasterId(this.manager_id);
    
    this.invoiceForm = this.fb.group({
      vendorName: ['', Validators.required],
      quantity: [1, Validators.required],
      unitPrice: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async getMasterId(managerId: any) {
    try {
      const userDocRef = this.firestore.collection('managers').doc(managerId).snapshotChanges();
      userDocRef.subscribe((doc: any) => {
        if (doc.payload.exists) {
          const userData = doc.payload.data();
          this.master_id = userData.master_id;
        } else {
          console.error('Manager document does not exist');
        }
      });
    } catch (error) {
      console.error('Error fetching machine data:', error);
    }
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      this.addDataToFirestore();
      this.invoiceForm.reset();
    }
  }

  async addDataToFirestore() {
    if (this.invoiceForm.valid) {
      const invoiceData = this.invoiceForm.value;
      const userId = sessionStorage.getItem('manager_id');
      if (userId) {
        const sgstRate = 9; 
        const cgstRate = 9; 
        const sgstAmount = (invoiceData.quantity * invoiceData.unitPrice * sgstRate) / 100;
        const cgstAmount = (invoiceData.quantity * invoiceData.unitPrice * cgstRate) / 100;
        const totalAmount = (invoiceData.quantity * invoiceData.unitPrice) + sgstAmount + cgstAmount;
  
        const firestoreData = {
          data: { ...invoiceData, sgstAmount, cgstAmount, totalAmount }, // Include sgstAmount, cgstAmount, totalAmount
          manager_id: userId, // Manager ID
          master_id: this.master_id, // Master ID
        };
  
        this.firestore.collection('invoices').add(firestoreData)
          .then((response) => {
            console.log('Data added successfully:', response);
            alert('Data added successfully');
          })
          .catch((error) => {
            console.error('Error adding data:', error);
          });
      }
    }
  }  
}
