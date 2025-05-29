import { Injectable } from '@angular/core';
import { Cheatsheet } from '../../models/cheatsheet';
import PocketBase, { RecordModel } from 'pocketbase';

@Injectable({
  providedIn: 'root',
})
export class CheatsheetService {
  private pb = new PocketBase('http://localhost:8090');

  constructor() {}

  public create(cheatsheet: Cheatsheet) {
    if (cheatsheet) {
      this.pb.collection('cheatsheets').create(cheatsheet);
    }
  }

  public getAllCheatsheets(): Promise<RecordModel[]> {
    return this.pb.collection('cheatsheets').getFullList();
  }

  public async getTopFourCheatSheets(): Promise<RecordModel[]> {
    const fullList = await this.getAllCheatsheets();

    return fullList
      .sort((a, b) => (b['stars'] ?? 0) - (a['stars'] ?? 0))
      .slice(0, 4);
  }
}
