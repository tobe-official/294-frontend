import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CheatsheetService } from '../../services/cheatsheet/cheatsheet.service';
import { RecordModel } from 'pocketbase';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-browse',
  imports: [HeaderComponent, MatCard, MatIcon, DatePipe, TranslatePipe],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
  standalone: true,
})
export class BrowseComponent {
  public cheatsheets: RecordModel[] = [];

  constructor(private cheatsheetService: CheatsheetService) {
    this.cheatsheetService.getAllCheatsheets().then((cheatsheets) => {
      this.cheatsheets = cheatsheets;
    });
  }
}
