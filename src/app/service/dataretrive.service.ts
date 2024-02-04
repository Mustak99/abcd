import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class DataretriveService {
  machineDataArray: any[] = [];
  constructor(   private authService: AuthService, private firestore: AngularFirestore,) { }
  async fetchMachineData() {
    try {
      const userId = await this.authService.getCurrentUserId();

      if (userId) {
        const userDocRef = this.firestore.collection('users').doc(userId);
        const machinesCollectionRef = userDocRef.collection('machines');
        
        const querySnapshot:any  = await machinesCollectionRef.get().toPromise();
        
        this.machineDataArray = querySnapshot.docs.map((doc: any) => {
          return {
            ...doc.data() as any,
          };
        });
      }
    } catch (error) {
      console.error('Error fetching machine data:', error);
    }
  }
}
