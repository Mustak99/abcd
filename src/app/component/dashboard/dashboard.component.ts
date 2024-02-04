import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { DataretriveService } from 'src/app/service/dataretrive.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  loggedInUserName: string | null = null;
  item: any;
  data$!: Observable<any>;
  userId: any;
  machineDataArray: any[] = [];
  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private dataRetrive: DataretriveService
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedInUserName().subscribe((userName) => {
      this.loggedInUserName = userName;
    });
    this.authService.getCurrentUserId().then((userId) => {
      this.userId = userId;
    });
    this.dataRetrive.fetchMachineData().then(()=>{
      this.machineDataArray = this.dataRetrive.machineDataArray;
    })
  }

  onDataAdded(event: any) {
    console.log('Data added in dashboard:', event);
  }
  logout() {
    this.authService.logout().then(() => {});
  }
}
