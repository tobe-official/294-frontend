import {Injectable} from '@angular/core';
import PocketBase, {ListResult, RecordModel} from 'pocketbase';
import {Router} from '@angular/router';
import {LoginUser} from '../../models/login-user';
import {User} from '../../models/user';
import {redirectTo} from '../../utils/router-functions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private pb = new PocketBase('http://localhost:8090');

  constructor(
    private router: Router,
  ) {}

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

  public isLoggedIn(): boolean {
    return this.pb.authStore.isValid;
  }

  public getLoggedInUser(): RecordModel | null {
    return this.pb.authStore.record;
  }

  public async getUserById(userId: string): Promise<RecordModel> {
    return await this.pb.collection('users').getOne(userId);
  }

  public getUsersByCredits(): Promise<ListResult<RecordModel>> {
    return this.pb.collection('users').getList(1, 10, {
      fields: 'name, credits',
      sort: '-credits',
    });
  }

  public async buyCheatsheet(id: string) {
    const user = this.getLoggedInUser();
    if (!user) return;

    const currentCheatsheets = user['acquired_cheatsheets'] || [];
    const updatedCheatsheets = [...currentCheatsheets, id];

    await this.pb.collection('users').update(user.id, {
      acquired_cheatsheets: updatedCheatsheets,
    });
  }

  public hasLoggedInUserAcquiredCheatsheet(cheatsheetId: string) {
    const user = this.getLoggedInUser();
    if (!user || !user['acquired_cheatsheets']) return false;
    return user['acquired_cheatsheets'].includes(cheatsheetId);
  }
}
