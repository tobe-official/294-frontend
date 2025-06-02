import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { redirectTo } from '../../utils/router-functions';
import { Router } from '@angular/router';
import { RouteLocations } from '../../models/route-locations';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatButton,
    MatIconButton,
    MatIcon,
    TranslatePipe,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public isLoggedIn: boolean = false;
  public isMobileMenuOpen: boolean = false;

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

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  public redirect(location: RouteLocations, isLogout: boolean): void {
    this.closeMobileMenu(); // Close menu when navigating
    if (isLogout) this.logout();
    else redirectTo(this.isLoggedIn ? location : 'login', this.router);
  }

  public logout(): void {
    this.closeMobileMenu();
    this.authService.logout().then(() => {
      redirectTo('', this.router);
    });
  }
}
