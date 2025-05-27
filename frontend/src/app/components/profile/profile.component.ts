import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../services/auth/auth.service';
import { RecordModel } from 'pocketbase';
import { Router } from '@angular/router';
import { redirectTo } from '../../utils/router-functions';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, HeaderComponent, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  public user: RecordModel;
  private emptyUser: RecordModel = {
    id: '',
    collectionId: '',
    collectionName: '',
  };
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    const loggedInUser = this.authService.getLoggedInUser();
    this.user = loggedInUser ?? this.emptyUser;
    if (!loggedInUser) redirectTo('', this.router);
  }
}
