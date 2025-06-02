import { Injectable } from '@angular/core';
import { Cheatsheet } from '../../models/cheatsheet';
import PocketBase, { ListResult, RecordModel } from 'pocketbase';

@Injectable({
  providedIn: 'root',
})
export class CheatsheetService {
  private pb = new PocketBase('http://localhost:8090');

  constructor() {}

  public async create(cheatsheet: Cheatsheet): Promise<RecordModel | null> {
    if (cheatsheet) {
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
}
