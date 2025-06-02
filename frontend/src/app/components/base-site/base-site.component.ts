import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { redirectTo } from '../../utils/router-functions';
import { RouteLocations } from '../../models/route-locations';
import { AuthService } from '../../services/auth/auth.service';
import { HeaderComponent } from '../header/header.component';
import { TranslatePipe } from '@ngx-translate/core';
import { RecordModel } from 'pocketbase';
import { CheatsheetService } from '../../services/cheatsheet/cheatsheet.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-base-site',
  standalone: true,
  imports: [MatButton, HeaderComponent, TranslatePipe, ReactiveFormsModule],
  templateUrl: './base-site.component.html',
  styleUrl: './base-site.component.scss',
})
export class BaseSiteComponent {
  public maxWidth: number = 768;
  public showImages: boolean = window.innerWidth > this.maxWidth;

  public user: RecordModel;
  public topCheatSheets: RecordModel[] = [];

  private emptyUser: RecordModel = {
    id: '',
    collectionId: '',
    collectionName: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private cheatSheetService: CheatsheetService,
  ) {
    const loggedInUser: RecordModel | null = this.authService.getLoggedInUser();
    this.user = loggedInUser ?? this.emptyUser;

    window.addEventListener('resize', () => {
      this.showImages = window.innerWidth > this.maxWidth;
    });

    this.cheatSheetService.getTopFourCheatSheets().then((cheatsheets) => {
      this.topCheatSheets = cheatsheets.items;
    });
  }

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public redirect(location: RouteLocations): void {
    redirectTo(this.isLoggedIn ? location : 'login', this.router);
  }

  protected readonly window = window;
}
