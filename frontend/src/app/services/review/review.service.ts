import { Injectable } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase';
import { Review } from '../../models/review';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private pb = new PocketBase('http://localhost:8090');
  constructor(private authService: AuthService) {
    this.pb.autoCancellation(false);
  }

  public async getReviewsByCheatsheetId(id: string): Promise<RecordModel[]> {
    return await this.pb.collection('reviews').getFullList({
      filter: `cheatsheet.id = "${id}"`,
    });
  }

  public async createReview(review: Review): Promise<RecordModel | null> {
    const reviewRecordModel = await this.pb
      .collection('reviews')
      .create(review);
    const cheatsheet = await this.pb
      .collection('cheatsheets')
      .getOne(review['cheatsheet']);

    // 1 credit for the user that reviewed it
    await this.authService.addCreditsToUser(1, review['user']);
    // Add credits to uploader after both are ready
    await this.authService.addCreditsToUser(
      review['stars'],
      cheatsheet['uploader'],
    );

    return reviewRecordModel;
  }

  public async calculateCheatsheetsStars(
    cheatsheetId: string,
  ): Promise<number> {
    const reviews = await this.getReviewsByCheatsheetId(cheatsheetId);
    if (!reviews || reviews.length === 0) {
      return 1;
    }
    const totalStars = reviews.reduce(
      (sum, review) => sum + (review['stars'] || 1),
      0,
    );
    const averageStars = totalStars / reviews.length;
    return Math.round(averageStars);
  }
}
