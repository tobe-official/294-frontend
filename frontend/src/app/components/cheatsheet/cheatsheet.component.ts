import { Component, inject, signal, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheatsheetService } from '../../services/cheatsheet/cheatsheet.service';
import { RecordModel } from 'pocketbase';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ReviewService } from '../../services/review/review.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Review } from '../../models/review';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cheatsheet',
  imports: [DatePipe, ReactiveFormsModule, TranslatePipe, HeaderComponent],
  templateUrl: './cheatsheet.component.html',
  styleUrl: './cheatsheet.component.scss',
})
export class CheatsheetComponent {
  public touched: Signal<boolean> = signal(false);
  public ratingSubmitted: Signal<boolean> = signal(false);
  public cheatsheetAcquired = false;
  public cheatsheet: RecordModel = {
    id: '',
    collectionId: '',
    collectionName: '',
  };
  public loggedInUserCredits: number = -1;
  public loggedInUserId: string = '';
  private cheatsheetId: string = '';
  private activatedRoute = inject(ActivatedRoute);
  public reviews: RecordModel[] = [];
  public userRating: number = 1;

  public form = new FormGroup({
    search: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private cheatsheetService: CheatsheetService,
    private reviewService: ReviewService,
  ) {
    this.fetchData();
  }

  public buyCheatsheet() {
    this.authService.buyCheatsheet(this.cheatsheetId).then(() => {
      this.cheatsheetAcquired = true;
    });
  }

  public setRating(rating: number) {
    this.userRating = rating;
  }

  public async submit() {
    this.touched = signal(true);
    if (this.form.valid) {
      const review: Review = {
        text: this.form.getRawValue().search || '',
        stars: this.userRating,
        cheatsheet: this.cheatsheetId,
        user: this.loggedInUserId,
      };
      await this.reviewService.createReview(review).then((record) => {
        if (record) {
          this.ratingSubmitted = signal(true);
          this.fetchData();
        } else {
          console.error('Creation failed');
        }
      });
      let number = 1;
      await this.reviewService
        .calculateCheatsheetsStars(this.cheatsheetId)
        .then((value) => {
          number = value;
        });
      await this.cheatsheetService.updateCheatsheetStars(
        number,
        this.cheatsheetId,
      );
    }
  }

  private fetchData() {
    const loggedInUser = this.authService.getLoggedInUser();
    this.loggedInUserCredits = loggedInUser ? loggedInUser['credits'] : -1;
    this.loggedInUserId = loggedInUser ? loggedInUser['id'] : '';
    this.activatedRoute.params.subscribe((params) => {
      this.cheatsheetId = params['id'];
    });
    if (this.cheatsheetId) {
      this.cheatsheetService
        .getCheatsheetById(this.cheatsheetId)
        .then((cheatsheet) => {
          this.cheatsheet = cheatsheet;
        });
    }
    this.reviewService
      .getReviewsByCheatsheetId(this.cheatsheetId)
      .then((reviews) => {
        this.reviews = reviews;
        const hasReviewed = reviews.some(
          (review) => review['user'] === this.loggedInUserId,
        );
        this.ratingSubmitted = signal(hasReviewed);
      });

    this.cheatsheetAcquired =
      this.authService.hasLoggedInUserAcquiredCheatsheet(this.cheatsheetId);
  }
}
