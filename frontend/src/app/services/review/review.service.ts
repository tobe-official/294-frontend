import { Injectable } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase';
import { Review } from '../../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private pb = new PocketBase('http://localhost:8090');
  constructor() {}

  public async getReviewsByCheatsheetId(id: string): Promise<RecordModel[]> {
    return await this.pb.collection('reviews').getFullList({
      filter: `cheatsheet.id = "${id}"`,
    });
  }

  public async createReview(review: Review): Promise<RecordModel | null> {
    if (review) {
      const recordModelPromise = this.pb.collection('reviews').create(review);
      return recordModelPromise;
    }
    throw new Error('invalid review');
  }

  public async calculateCheatsheetsStars(
    cheatsheetId: string,
  ): Promise<number> {
    let averageStars: number = 0;
    await this.getReviewsByCheatsheetId(cheatsheetId).then((reviews) => {
      if (reviews.length > 0) {
        const totalStars = reviews.reduce(
          (sum, review) => sum + (review['stars'] || 0),
          0,
        );
        averageStars = totalStars / reviews.length;
      }
    });
    return Math.round(averageStars);
  }
}
