import {Component, inject, signal, Signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CheatsheetService} from '../../services/cheatsheet/cheatsheet.service';
import {RecordModel} from 'pocketbase';
import {DatePipe} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {ReviewService} from '../../services/review/review.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-cheatsheet',
  imports: [DatePipe, ReactiveFormsModule, TranslatePipe],
  templateUrl: './cheatsheet.component.html',
  styleUrl: './cheatsheet.component.scss',
})
export class CheatsheetComponent {
  public touched: Signal<boolean> = signal(false);
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
  public userRating: number = 0

  public form = new FormGroup({
    search: new FormControl<string>('', [Validators.required]),
  });

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

  public buyCheatsheet() {
    this.authService.buyCheatsheet(this.cheatsheetId).then(() => {
      this.cheatsheetAcquired = true;
    });
  }

  public setRating(rating: number) {
    this.userRating = rating;
  }

  public submit() {
    this.touched = signal(true);
  }
}
