import { Injectable } from '@angular/core';
import { Cheatsheet } from '../../models/cheatsheet';
import PocketBase, { ListResult, RecordModel } from 'pocketbase';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CheatsheetService {
  private pb = new PocketBase('http://localhost:8090');

  constructor(private authService: AuthService) {}

  public async create(cheatsheet: Cheatsheet): Promise<RecordModel | null> {
    const loggedInUser = this.authService.getLoggedInUser();
    if (cheatsheet && loggedInUser) {
      await this.authService.addCreditsToUser(1, loggedInUser['id']);
      return this.pb.collection('cheatsheets').create(cheatsheet);
    }
    throw new Error('invalid cheatsheet');
  }

  public getAllCheatsheets(): Promise<RecordModel[]> {
    return this.pb.collection('cheatsheets').getFullList();
  }

  public async getTopFourCheatSheets(): Promise<ListResult<RecordModel>> {
    return this.pb.collection('cheatsheets').getList(1, 4, {
      sort: '-stars',
    });
  }

  public async getCheatsheetById(id: string) {
    return this.pb.collection('cheatsheets').getOne(id);
  }

  public async updateCheatsheetStars(stars: number, id: string) {
    if (stars && id) {
      return this.pb.collection('cheatsheets').update(id, {
        stars,
      });
    }
    throw new Error('stars or id are invalid');
  }
}
