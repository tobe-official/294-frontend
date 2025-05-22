import { Injectable } from '@angular/core';
import { Cheatsheet } from '../../models/cheatsheet';
import PocketBase from 'pocketbase';

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
}
