import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { redirectTo } from '../../utils/router-functions';
import { RouteLocations } from '../../models/route-locations';
import { AuthService } from '../../services/auth/auth.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-base-site',
  standalone: true,
  imports: [MatButton, HeaderComponent],
  templateUrl: './base-site.component.html',
  styleUrl: './base-site.component.scss',
})
export class BaseSiteComponent {
  public isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  public redirect(location: RouteLocations): void {
    redirectTo(this.isLoggedIn ? location : 'login', this.router);
  }
}
