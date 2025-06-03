import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../services/auth/auth.service';
import { CheatsheetService } from '../../services/cheatsheet/cheatsheet.service';
import { RecordModel } from 'pocketbase';
import { Router } from '@angular/router';
import { redirectTo } from '../../utils/router-functions';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, HeaderComponent, TranslatePipe, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  public user: RecordModel;
  private readonly isBrowser: boolean;
  public maxWidth: number = 768;
  public showImages: boolean = true;
  private resizeListener?: () => void;
  public allCheatsheets: RecordModel[] = [];
  public userCheatsheets: RecordModel[] = [];
  public isLoading: boolean = true;

  private emptyUser: RecordModel = {
    id: '',
    collectionId: '',
    collectionName: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private cheatsheetService: CheatsheetService,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    const loggedInUser = this.authService.getLoggedInUser();
    this.user = loggedInUser ?? this.emptyUser;
    if (!loggedInUser) redirectTo('', this.router);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private loadUserCheatsheets() {
    this.cheatsheetService
      .getAllCheatsheets()
      .then((cheatsheets) => {
        this.allCheatsheets = cheatsheets;
        this.userCheatsheets = cheatsheets.filter(
          (sheet) => sheet['uploader'] === this.user.id,
        );
        this.sortByStars();
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading cheatsheets:', error);
        this.isLoading = false;
      });
  }

  private sortByStars() {
    this.userCheatsheets.sort((a, b) => (b['stars'] || 0) - (a['stars'] || 0));
  }

  public navigateToCheatsheet(cheatsheetId: string) {
    this.router.navigate(['/cheatsheet', cheatsheetId]).then((r) => r);
  }

  public ngOnInit() {
    this.loadUserCheatsheets();

    if (this.isBrowser) {
      this.updateShowImages();
      this.resizeListener = () => this.updateShowImages();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  private updateShowImages(): void {
    this.showImages = this.isBrowser && window.innerWidth > this.maxWidth;
  }
}
