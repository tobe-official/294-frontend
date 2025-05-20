import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { User } from '../../models/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private pb = new PocketBase('http://localhost:8090');

  constructor(private router: Router) {}

  public async register(user: User) {
    if (user) {
      await this.pb.collection('users').create(user);
    }
  }
  public async logout() {
    this.pb.authStore.clear();
    await this.router.navigate(['/']);
  }

  public async login(user: User) {
    if (user.email && user.password) {
      await this.pb
        .collection('users')
        .authWithPassword(user.email, user.password);
    } else {
      console.error('email or password is null');
    }
    return this.pb.authStore.isValid;
  }

  public async isLoggedIn() {
    return this.pb.authStore.isValid;
  }
}
