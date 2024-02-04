import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

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

      await result.user?.updateProfile({
        displayName: username,
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
      this.router.navigate(['dashboard']);
    } catch (err: any) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        alert('Invalid email or password');
      } else {
        alert(err.message);
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
      console.log('Logout successful');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}
