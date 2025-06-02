import { Injectable } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private pb = new PocketBase('http://localhost:8090');
  constructor() {}

  public getReviewsByCheatsheetId(id: string): Promise<RecordModel[]> {
    return this.pb.collection('reviews').getFullList({
      filter: `cheatsheet.id = "${id}"`,
    });
  }
}
