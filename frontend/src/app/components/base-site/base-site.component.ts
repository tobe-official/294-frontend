import {Component, OnInit, OnDestroy, Inject, PLATFORM_ID} from '@angular/core';
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
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-base-site',
  standalone: true,
  imports: [MatButton, HeaderComponent, TranslatePipe, NgOptimizedImage],
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
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    const loggedInUser: RecordModel | null = this.authService.getLoggedInUser();
    this.user = loggedInUser ?? this.emptyUser;

    // Dummy data for cards until real data is here
    this.topCheatSheets = [
      {
        id: '1',
        collectionId: '',
        collectionName: '',
        title: 'Physics Summary',
        description: 'All formulas at a glance',
        thumbnailUrl:
          'https://website-assets.studocu.com/img/document_thumbnails/e38561f1b1db6796e9870f64a81caf58/thumb_1200_848.png',
        stars: 4,
        pdfUrl: '',
        uploader: 'user1',
      },
      {
        id: '2',
        collectionId: '',
        collectionName: '',
        title: 'Linear Algebra',
        description: 'Matrices, vectors & more',
        thumbnailUrl:
          'https://data.templateroller.com/pdf_docs_html/2638/26385/2638595/page_1_thumb_950.png',
        stars: 3,
        pdfUrl: '',
        uploader: 'user2',
      },
      {
        id: '3',
        collectionId: '',
        collectionName: '',
        title: 'Python Cheat Sheet',
        description: 'Most used syntax & functions',
        thumbnailUrl:
          'https://www.datasciencecentral.com/wp-content/uploads/2021/10/YTPN7r6.png',
        stars: 5,
        pdfUrl: '',
        uploader: 'user3',
      },
      {
        id: '4',
        collectionId: '',
        collectionName: '',
        title: 'Java cheat sheet',
        description: 'Cheat sheet about Java',
        thumbnailUrl:
          'https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/9/4/n/large-java-wall-chart-fundamental-cheat-sheet-java-chart-original-imah52f9rjfhrjx7.jpeg?q=90&crop=false',
        stars: 6,
        pdfUrl: '',
        uploader: 'user4',
      },
    ] as RecordModel[];
  }

  public ngOnInit(): void {
    if (this.isBrowser) {
      this.updateShowImages();
      this.resizeListener = () => this.updateShowImages();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  public ngOnDestroy(): void {
    if (this.isBrowser && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private updateShowImages(): void {
    if (this.isBrowser) {
      this.showImages = window.innerWidth > this.maxWidth;
    }
  }

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public redirect(location: RouteLocations): void {
    redirectTo(this.isLoggedIn ? location : 'login', this.router);
  }

  public get window(): Window | undefined {
    return this.isBrowser ? window : undefined;
  }
}
