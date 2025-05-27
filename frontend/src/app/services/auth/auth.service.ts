import { Injectable } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase';
import { Router } from '@angular/router';
import { LoginUser } from '../../models/login-user';
import { User } from '../../models/user';
import { redirectTo } from '../../utils/router-functions';

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
    redirectTo('', this.router);
  }

  public async login(user: LoginUser) {
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

  public getLoggedInUser(): RecordModel | null {
    return this.pb.authStore.record;
  }

  public async getUserById(userId: string): Promise<RecordModel> {
    return await this.pb.collection('users').getOne(userId);
  }
}
