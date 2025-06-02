import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheatsheetService } from '../../services/cheatsheet/cheatsheet.service';
import { RecordModel } from 'pocketbase';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ReviewService } from '../../services/review/review.service';

@Component({
  selector: 'app-cheatsheet',
  imports: [DatePipe],
  templateUrl: './cheatsheet.component.html',
  styleUrl: './cheatsheet.component.scss',
})
export class CheatsheetComponent {
  public cheatsheetAcquired = false;
  public cheatsheet: RecordModel = {
    id: '',
    collectionId: '',
    collectionName: '',
  };
  public loggedInUserCredits: number;
  private cheatsheetId: string = '';
  private activatedRoute = inject(ActivatedRoute);
  public reviews: RecordModel[] = [];

  constructor(
    private authService: AuthService,
    private cheatsheetService: CheatsheetService,
    private reviewService: ReviewService,
  ) {
    const loggedInUser = this.authService.getLoggedInUser();
    this.loggedInUserCredits = loggedInUser ? loggedInUser['credits'] : -1;
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
      });

    this.cheatsheetAcquired = authService.hasLoggedInUserAcquiredCheatsheet(
      this.cheatsheetId,
    );
  }

  public submit() {
    this.authService.buyCheatsheet(this.cheatsheetId).then(() => {
      this.cheatsheetAcquired = true;
    });
  }
}
