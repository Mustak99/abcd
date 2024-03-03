import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { DataretriveService } from 'src/app/service/dataretrive.service';
import { Observable } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-commonlayout',
  templateUrl: './commonlayout.component.html',
  styleUrl: './commonlayout.component.css',
})
export class CommonlayoutComponent {
  currentTime: Date = new Date();
  loggedInUserName: string | null = null;
  manager_id: any;
  user_id:any;
  constructor(private authService: AuthService) {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
  ngOnInit(): void {
    this.manager_id = sessionStorage.getItem('manager_id');
    this.user_id=sessionStorage.getItem('user_id');
    this.authService.getLoggedInUserName().subscribe((userName) => {
      this.loggedInUserName = userName;
    });
  }
  logout() {
    this.authService.logout().then(() => {});
  }
}
