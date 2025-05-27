import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { RecordModel } from 'pocketbase';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-credits',
  imports: [HeaderComponent, TranslatePipe, NgClass],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss',
})
export class CreditsComponent {
  public users: RecordModel[] = [];

  constructor(private authService: AuthService) {
    this.authService.getUsersByCredits().then((userList) => {
      this.users = userList.items;
    });
  }
}
