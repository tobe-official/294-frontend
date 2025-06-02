import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {DatePipe, isPlatformBrowser} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime} from 'rxjs';
import {Router} from '@angular/router';

import {HeaderComponent} from '../header/header.component';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

import {CheatsheetService} from '../../services/cheatsheet/cheatsheet.service';
import {RecordModel} from 'pocketbase';
import {RouteLocations} from '../../models/route-locations';
import {redirectTo} from '../../utils/router-functions';
import {levenshteinEditDistance} from 'levenshtein-edit-distance';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    HeaderComponent,
    MatIcon,
    TranslatePipe,
    ReactiveFormsModule,
    DatePipe,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
  public allCheatsheets: RecordModel[] = [];
  public cheatsheets: RecordModel[] = [];
  public showImages: boolean = true;

  public form = new FormGroup({
    search: new FormControl<string>('', []),
  });

  private readonly isBrowser: boolean;
  private readonly maxWidth = 768;
  private resizeListener?: () => void;

  constructor(
    private cheatsheetService: CheatsheetService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ngOnInit(): void {
    if (this.isBrowser) {
      this.updateShowImages();
      this.resizeListener = () => this.updateShowImages();
      window.addEventListener('resize', this.resizeListener);
    }

    this.cheatsheetService.getAllCheatsheets().then((cheatsheets) => {
      this.allCheatsheets = cheatsheets;
      this.sortByStars();

      this.form.get('search')?.valueChanges
        .pipe(debounceTime(300))
        .subscribe((searchTerm) => this.filterCheatsheets(searchTerm || ''));
    });
  }

  private sortByStars(): void {
    this.cheatsheets = [...this.allCheatsheets].sort((a, b) => {
      const starsA = Number(a['stars'] || 0);
      const starsB = Number(b['stars'] || 0);
      return starsB - starsA;
    });
  }

  private filterCheatsheets(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.sortByStars();
      return;
    }

    const term = searchTerm.toLowerCase();

    const scored = this.allCheatsheets.map((sheet) => {
      const title = String(sheet['title'] || '').toLowerCase();
      const desc = String(sheet['description'] || '').toLowerCase();
      const score = Math.min(
        levenshteinEditDistance(term, title),
        levenshteinEditDistance(term, desc)
      );
      return {
        cheatsheet: sheet,
        score: title.includes(term) || desc.includes(term) ? -1 : score,
      };
    });

    const threshold = Math.max(3, Math.floor(term.length * 0.7));
    scored.sort((a, b) => a.score - b.score);

    this.cheatsheets = scored
      .filter((x) => x.score === -1 || x.score <= threshold)
      .map((x) => x.cheatsheet);
  }

  private updateShowImages(): void {
    this.showImages = this.isBrowser && window.innerWidth > this.maxWidth;
  }

  public redirect(location: RouteLocations): void {
    redirectTo(location, this.router);
  }
}
