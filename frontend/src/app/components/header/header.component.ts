import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { redirectTo } from '../../utils/router-functions';
import { Router } from '@angular/router';
import { RouteLocations } from '../../models/route-locations';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatButton, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  public get loginButtonLabel(): string {
    return this.isLoggedIn
      ? 'header.logoutButtonLabel'
      : 'header.loginButtonLabel';
  }

  public redirect(location: RouteLocations, isLogout: boolean): void {
    if (isLogout) this.logout();
    else redirectTo(this.isLoggedIn ? location : 'login', this.router);
  }

  public logout(): void {
    this.authService.logout().then(() => {
      redirectTo('', this.router);
    });
  }

  protected readonly redirectTo = redirectTo;
}
