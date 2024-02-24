import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  doc,
  setDoc,
} from 'firebase/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  async register(
    email: string,
    password: string,
    username: string
  ): Promise<void> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Update user profile display name if user exists
      await result.user?.updateProfile({
        displayName: username,
      });

      // Add user details to Firestore if user exists
      const db: any = getFirestore();
      const userDocRef = doc(db, 'users', result.user?.uid || '');

      await setDoc(userDocRef, {
        email: email,
        password: password,
        username: username,
      });

      alert('Registration successful:');
    } catch (error) {
      alert('Registration failed: ' + error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.getCurrentUserId().then((userId) => {
        if (userId) {
          this.firestore
          .collection('managers')
            .doc(userId)
            .get()
            .subscribe((managerDoc) => {
              if (managerDoc.exists) {
                sessionStorage.setItem('manager_id', userId);
              }
            });
          this.firestore
          .collection('users')
          .doc(userId)
          .get()
          .subscribe((users) => {
            if (users.exists) {
                sessionStorage.setItem('user_id', userId);
              }
            });
          }
        });
        setTimeout(() => {
          this.router.navigate(['dashboard']);
        }, 2000);
    } catch (err: any) {
      if (err.code) {
        if (err.code == 'auth/user-not-found') {
          alert('Invalid email');
        } else if (err.code == 'auth/wrong-password') {
          alert('Invalid password');
        } else {
          alert(err.message);
        }
      } else {
        alert('Invalid email or Password');
      }
    }
  }

  getLoggedInUserName(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map((user) => (user ? user.displayName : null))
    );
  }
  getCurrentUserId(): Promise<string | null> {
    return this.afAuth.currentUser
      .then((user) => {
        return user ? user.uid : null;
      })
      .catch((error) => {
        console.error('Error getting current user:', error);
        return null;
      });
  }

  async isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this.afAuth.authState.subscribe((user) => {
        const isAuthenticated = !!user;
        resolve(isAuthenticated);

        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      });
    });
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}
