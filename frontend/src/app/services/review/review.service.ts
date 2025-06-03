import { Injectable } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase';
import { Review } from '../../models/review';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private pb = new PocketBase('http://localhost:8090');
  constructor(private authService: AuthService) {}

  public async getReviewsByCheatsheetId(id: string): Promise<RecordModel[]> {
    return await this.pb.collection('reviews').getFullList({
      filter: `cheatsheet.id = "${id}"`,
    });
  }

  public async createReview(review: Review): Promise<RecordModel | null> {
    const reviewRecordModelPromise = this.pb
      .collection('reviews')
      .create(review);
    const cheatsheetRecordModelPromise = this.pb
      .collection('cheatsheets')
      .getOne(review['cheatsheet']);
    if (reviewRecordModelPromise) {
      // 1 credit for the user that reviewed it
      await this.authService.addCreditsToUser(1, review['user']);
      // star amount of credits for the uploader
      await cheatsheetRecordModelPromise.then((cheatsheet) => {
        this.authService.addCreditsToUser(
          review['stars'],
          cheatsheet['uploader'],
        );
      });
      return reviewRecordModelPromise;
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
