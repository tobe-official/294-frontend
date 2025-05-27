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
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  public redirect(location: RouteLocations) {
    redirectTo(location, this.router);
  }

  public logout() {
    this.authService.logout().then(r => r);
  }
}
