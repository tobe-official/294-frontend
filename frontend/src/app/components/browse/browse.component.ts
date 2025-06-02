import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CheatsheetService } from '../../services/cheatsheet/cheatsheet.service';
import { RecordModel } from 'pocketbase';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { levenshteinEditDistance } from 'levenshtein-edit-distance';

@Component({
  selector: 'app-browse',
  imports: [
    HeaderComponent,
    MatCard,
    MatIcon,
    DatePipe,
    TranslatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
  standalone: true,
})
export class BrowseComponent implements OnInit {
  public allCheatsheets: RecordModel[] = [];
  public cheatsheets: RecordModel[] = [];

  public form = new FormGroup({
    search: new FormControl<string>('', []),
  });

  constructor(private cheatsheetService: CheatsheetService) {}

  public ngOnInit() {
    this.cheatsheetService.getAllCheatsheets().then((cheatsheets) => {
      this.allCheatsheets = cheatsheets;
      this.cheatsheets = [...cheatsheets];

      // Apply search filter with debounce
      this.form
        .get('search')
        ?.valueChanges.pipe(debounceTime(300))
        .subscribe((searchTerm) => {
          this.filterCheatsheets(searchTerm || '');
        });
    });
  }

  private filterCheatsheets(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.cheatsheets = [...this.allCheatsheets];
      return;
    }

    searchTerm = searchTerm.toLowerCase();

    const scoredCheatsheets = this.allCheatsheets.map((sheet) => {
      const title = String(sheet['title']).toLowerCase();
      const description = String(sheet['description']).toLowerCase();

      // Get minimum Levenshtein distance
      const titleDistance = levenshteinEditDistance(searchTerm, title);
      const descriptionDistance = levenshteinEditDistance(
        searchTerm,
        description,
      );

      // Direct matches get priority
      const containsMatch =
        title.includes(searchTerm) || description.includes(searchTerm);

      return {
        cheatsheet: sheet,
        score: containsMatch
          ? -1
          : Math.min(titleDistance, descriptionDistance),
      };
    });

    // Sort by score (lower is better)
    scoredCheatsheets.sort((a, b) => a.score - b.score);

    // Filter out irrelevant results
    const threshold = Math.max(3, Math.floor(searchTerm.length * 0.7));

    this.cheatsheets = scoredCheatsheets
      .filter((item) => item.score === -1 || item.score <= threshold)
      .map((item) => item.cheatsheet);
  }
}
