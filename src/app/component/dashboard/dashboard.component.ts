import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { DataretriveService } from 'src/app/service/dataretrive.service';
import { Observable } from 'rxjs';
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
  abc: any;
  constructor(
    private authService: AuthService,
    private dataRetrive: DataretriveService
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedInUserName().subscribe((userName) => {
      this.loggedInUserName = userName;
    });
    this.userId=localStorage.getItem('user_id')
    this.dataRetrive.fetchMachineData().then(() => {
      this.machineDataArray = this.dataRetrive.machineDataArray;
    });
  }

  onDataAdded(event: any) {
    console.log('Data added in dashboard:', event);
  }
  logout() {
    this.authService.logout().then(() => {});
  }
}
