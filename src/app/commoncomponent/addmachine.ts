import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-machine-form',
  template: `
    <div style="border-bottom: #978da8 solid 1px; display: flex">
      <p
        class="mb-0 pr-1 cursor"
        (click)="onof(true)"
        [ngStyle]="{ color: toggle ? 'black' : '#978da8' }"
      >
        Add Machine
      </p>
      <p
        class="pl-1 mb-0 cursor"
        (click)="onof(false)"
        [ngStyle]="{ color: !toggle ? 'black' : '#978da8' }"
      >
        Update Machine
      </p>
    </div>
    <div
      class="card"
      style="width: 70%;margin: auto;margin-top:20px;"
      *ngIf="toggle"
    >
      <div class="card-body">
        <h2>Add Machine</h2>
        <form [formGroup]="machineForm" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-md-4">
              <label for="machineNo">Machine No:</label>
              <input
                type="text"
                id="machineNo"
                formControlName="mNo"
                class="form-control"
              />
            </div>

            <div class="col-md-4">
              <label for="machineType">Machine Type:</label>
              <input
                type="text"
                id="machineType"
                formControlName="machineType"
                class="form-control"
              />
            </div>

            <div class="col-md-4">
              <label for="status">Status:</label>
              <input
                type="text"
                id="status"
                formControlName="status"
                class="form-control"
              />
            </div>
          </div>
          <div formGroupName="Production Order">
            <div class="row">
              <div class="col-md-4">
                <label for="orderNo">Order No:</label>
                <input
                  type="text"
                  id="orderNo"
                  formControlName="Order No"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="articleName">Article Name:</label>
                <input
                  type="text"
                  id="articleName"
                  formControlName="Artical Name"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="reqOnDate">Req. On Date:</label>
                <input
                  type="text"
                  id="reqOnDate"
                  formControlName="Req. On Date"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="startDate">Start Date:</label>
                <input
                  type="text"
                  id="startDate"
                  formControlName="Start Date"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="startTime">Start Time:</label>
                <input
                  type="text"
                  id="startTime"
                  formControlName="Start Time"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <div formGroupName="Current Shift Time">
            <div class="row">
              <div class="col-md-4">
                <label for="shiftStartTime">Shift Start Time:</label>
                <input
                  type="text"
                  id="shiftStartTime"
                  formControlName="Shift Start Time"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="totalRunTime">Total Run Time:</label>
                <input
                  type="text"
                  id="totalRunTime"
                  formControlName="Total Run Time"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="totalStopTime">Total Stop Time:</label>
                <input
                  type="text"
                  id="totalStopTime"
                  formControlName="Total Stop Time"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="totalStops">Total Stops:</label>
                <input
                  type="number"
                  id="totalStops"
                  formControlName="Total Stops"
                  class="form-control"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div formGroupName="Current Shift Speed">
            <div class="row">
              <div class="col-md-4">
                <label for="plannedSpeed">Planned Speed:</label>
                <input
                  type="number"
                  id="plannedSpeed"
                  formControlName="Planned"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="actualSpeed">Actual Speed:</label>
                <input
                  type="number"
                  id="actualSpeed"
                  formControlName="Actual"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="averageSpeed">Average Speed:</label>
                <input
                  type="number"
                  id="averageSpeed"
                  formControlName="Average"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="speedTotalStops">Total Stops:</label>
                <input
                  type="number"
                  id="speedTotalStops"
                  formControlName="Total Stops"
                  class="form-control"
                />
              </div>
            </div>
          </div>
          <div formGroupName="quantity">
            <div class="row">
              <div class="col-md-4">
                <label for="plannedQuantity">Planned Quantity:</label>
                <input
                  type="number"
                  id="plannedQuantity"
                  formControlName="Planned"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="actualQuantity">Actual Quantity:</label>
                <input
                  type="number"
                  id="actualQuantity"
                  formControlName="Actual"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <div formGroupName="Pieces">
            <div class="row">
              <div class="col-md-4">
                <label for="plannedPieces">Planned Pieces:</label>
                <input
                  type="number"
                  id="plannedPieces"
                  formControlName="Planned"
                  class="form-control"
                />
              </div>
              <div class="col-md-4">
                <label for="actualPieces">Actual Pieces:</label>
                <input
                  type="number"
                  id="actualPieces"
                  formControlName="Actual"
                  class="form-control"
                />
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">Add Data</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Table to display existing machines -->
    <div
      class="card"
      style="width: 70%; margin: auto; margin-top: 20px;"
      *ngIf="!toggle"
    >
      <div class="card-body">
        <h2>Update Machine Status</h2>
        <table class="table">
          <thead>
            <tr>
              <th>srNo.</th>
              <th>Machine Number</th>
              <th>Status</th>
              <th class="d-flex justify-content-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let machine of machineDataArray ; let i =index;" >
              <td>{{ i + 1 }}</td>
              <td>{{ machine.data.mNo }}</td>
              <td>
                <select
                  class="form-control"
                  [(ngModel)]="machine.data.status"
                  (change)="updateStatus(machine)"
                >
                  <option value="running">Running</option>
                  <option value="stop">Stop</option>
                  <option value="ideal">Ideal</option>
                </select>
              </td>
              <td class="d-flex justify-content-center">
                <button
                  class="btn btn-danger"
                  (click)="deleteMachine(machine)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [``],
})
export class MachineFormComponent {
  @Output() dataAdded = new EventEmitter<any>();
  machineForm!: FormGroup;
  manager_id: any;
  master_id!: any;
  toggle = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {
    this.initForm();
  }
  ngOnInit() {
    this.manager_id = sessionStorage.getItem('manager_id');
    this.getMasterId(this.manager_id);
    this.fetchMachines(this.manager_id);
  }
  ngOnChange(){

  }
  onof(parametr: boolean) {
    this.toggle = parametr;
  }

  async getMasterId(managerId: any) {
    try {
      const userDocRef = this.firestore
        .collection('managers')
        .doc(managerId)
        .snapshotChanges();
      userDocRef.subscribe((doc: any) => {
        if (doc.payload.exists) {
          const userData = doc.payload.data();
          const masterId = userData.master_id;
          this.master_id = masterId;
        } else {
          console.error('Manager document does not exist');
        }
      });
    } catch (error) {
      console.error('Error fetching machine data:', error);
    }
  }

  initForm() {
    this.machineForm = this.fb.group({
      mNo: ['', Validators.required],
      machineType: ['', Validators.required],
      status: ['', Validators.required],
      'Production Order': this.fb.group({
        'Order No': ['', Validators.required],
        'Artical Name': ['', Validators.required],
        'Req. On Date': ['', Validators.required],
        'Start Date': ['', Validators.required],
        'Start Time': ['', Validators.required],
      }),
      'Current Shift Time': this.fb.group({
        'Shift Start Time': ['', Validators.required],
        'Total Run Time': ['', Validators.required],
        'Total Stop Time': ['', Validators.required],
        'Total Stops': [0, Validators.required],
      }),
      'Current Shift Speed': this.fb.group({
        Planned: [0, Validators.required],
        Actual: [0, Validators.required],
        Average: [0, Validators.required],
        'Total Stops': [0, Validators.required],
      }),
      quantity: this.fb.group({
        Planned: [0, Validators.required],
        Actual: [0, Validators.required],
      }),
      Pieces: this.fb.group({
        Planned: [0, Validators.required],
        Actual: [0, Validators.required],
      }),
    });
  }

  onSubmit() {
    if (this.machineForm.valid) {
      this.addDataToFirestore();
      this.machineForm.reset();
    }
  }

  async addDataToFirestore() {
    if (this.machineForm.valid) {
      const machineData = this.machineForm.value;
      const userId = sessionStorage.getItem('manager_id');
      if (userId) {
        const firestoreData = {
          data: machineData,
          manager_id: userId,
          master_id: this.master_id,
        };
        this.firestore
          .collection('machines')
          .add(firestoreData)
          .then((response) => {
            console.log('Data added successfully:', response);
            alert('Data added successfully');
            this.dataAdded.emit();
          })
          .catch((error) => {
            console.error('Error adding data:', error);
          });
      }
    }
  }

  machineDataArray: any[] = [];
  async fetchMachines(userId: string) {
    try {
      let query = this.firestore.collection('machines', (ref) =>
        ref.where(this.manager_id ? 'manager_id' : 'master_id', '==', userId)
      );

      const snapshot = await query.get().toPromise();

      if (snapshot && !snapshot.empty) {
        this.machineDataArray = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id; // Get the document ID
          if (typeof data === 'object' && data !== null) {
            return { id, ...data };
          } else {
            console.error('Document data is not an object:', data);
            return { id };
          }
        });
      } else {
        this.machineDataArray = [];
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
      this.machineDataArray = [];
    }
  }
  async deleteMachine(machine: any) {
    try {
      const confirmed = confirm("Are you sure you want to delete this machine?");
      if (confirmed) {
        await this.firestore.collection('machines').doc(machine.id).delete();
        this.machineDataArray=[];
        this.fetchMachines(this.manager_id);
        alert("Machine deleted successfully!");
      } else {
        alert("Deletion canceled.");
      }
    } catch (error) {
      console.log('Error deleting machine:' + error);
      alert("An error occurred while deleting the machine.");
    }
  }
  
  async updateStatus(machine: any) {
    try {
      await this.firestore
        .collection('machines')
        .doc(machine.id)
        .update({ 'data.status': machine.data.status });
      console.log('Status updated successfully');
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }
}
