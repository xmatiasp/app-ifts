import { Injectable } from '@angular/core';
import { signOut } from '@angular/fire/auth';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) { }

  async register({ email, password}) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e){
      return null;
    }
  }

  async login({ email, password}) {
    try {
      const user = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e){
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }

  async ressetpassword({email}){
    try {
      const user = await sendPasswordResetEmail(
        this.auth,
        email
      );
      return user;
    } catch (e){
      return null;
    }
  }
}
