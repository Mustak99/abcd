import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-managerlogin',
  templateUrl: './managerlogin.component.html',
  styleUrl: './managerlogin.component.css'
})
export class ManagerloginComponent {
  managerPhone: string = '';
  managerPassword: string = '';

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  async onSubmit() {
    try {
      await this.loginManager(this.managerPhone, this.managerPassword);
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error appropriately
    }
  }

  async loginManager(managerPhone: string, managerPassword: string) {
    try {
      const userId = await this.authService.getCurrentUserId();

      if (userId) {
        const userDocRef = this.firestore.collection('users').doc(userId);
        const managersCollectionRef = userDocRef.collection('managers');

        const querySnapshot = await managersCollectionRef.get().toPromise();

        if (querySnapshot && querySnapshot.size > 0) {
          const managers = querySnapshot.docs.map(doc => doc.data() as any);

          const manager = managers.find(m => m.managerPhone === managerPhone && m.managerPassword === managerPassword);

          if (manager) {
            // Implement your login logic here
            console.log('Manager logged in successfully'+manager);
            
          } else {
            console.log('Login Id or password is wrong');
          }
        } else {
          console.error('No manager found for the current user');
          // Handle case when no manager is found for the user
        }
      }
    } catch (error) {
      console.error('Error fetching manager data:', error);
      // Handle error appropriately
    }
  }
}