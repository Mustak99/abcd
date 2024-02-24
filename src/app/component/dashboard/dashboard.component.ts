import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { DataretriveService } from 'src/app/service/dataretrive.service';
import { Observable } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  item: any;
  data$!: Observable<any>;
  userId: any;
  machineDataArray: any[] = [];

  constructor(
    private authService: AuthService,
    private dataRetrive: DataretriveService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('user_id');
    // this.dataRetrive.fetchMachineData().then(() => {
    //   this.machineDataArray = this.dataRetrive.machineDataArray;
    // });
    this.fetchMachines(this.userId);
  }

  async fetchMachines(userId: string) {
    try {
      const snapshot = await this.firestore
        .collection('machines', (ref) => ref.where('master_id', '==', userId))
        .get()
        .toPromise();
      if (snapshot) {
        const data = snapshot.docs.map((doc: any) => (doc.data() as any).data);
        this.machineDataArray = data;
      } else {
        this.machineDataArray = [];
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
      this.machineDataArray = [];
    }
  }
  onDataAdded(event: any) {
    console.log('Data added in dashboard:', event);
  }
 
}
