import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {redirectTo} from '../../utils/router-functions';
import {RouteLocations} from '../../models/route-locations';
import {AuthService} from '../../services/auth/auth.service';
import {HeaderComponent} from '../header/header.component';
import {TranslatePipe} from '@ngx-translate/core';
import {RecordModel} from 'pocketbase';
import {CheatsheetService} from '../../services/cheatsheet/cheatsheet.service';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-base-site',
  standalone: true,
  imports: [MatButton, HeaderComponent, TranslatePipe, ReactiveFormsModule],
  templateUrl: './base-site.component.html',
  styleUrl: './base-site.component.scss',
})
export class BaseSiteComponent implements OnInit, OnDestroy {
  public maxWidth: number = 768;
  public showImages: boolean = true;
  private readonly isBrowser: boolean;

  public user: RecordModel;
  public topCheatSheets: RecordModel[] = [];

  private emptyUser: RecordModel = {
    id: '',
    collectionId: '',
    collectionName: '',
  };

  private resizeListener?: () => void;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cheatSheetService: CheatsheetService,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    const loggedInUser: RecordModel | null = this.authService.getLoggedInUser();
    this.user = loggedInUser ?? this.emptyUser;
  }

  public ngOnInit(): void {
    if (this.isBrowser) {
      this.updateShowImages();
      this.resizeListener = () => this.updateShowImages();
      window.addEventListener('resize', this.resizeListener);
    }

    this.cheatSheetService.getTopFourCheatSheets().then((cheatsheets) => {
      this.topCheatSheets = cheatsheets.items;
    });
  }

  public ngOnDestroy(): void {
    if (this.isBrowser && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private updateShowImages(): void {
    this.showImages = this.isBrowser && window.innerWidth > this.maxWidth;
  }

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public redirect(location: RouteLocations): void {
    redirectTo(this.isLoggedIn ? location : 'login', this.router);
  }
}
