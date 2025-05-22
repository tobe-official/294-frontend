import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { redirectTo } from '../../utils/router-functions';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [MatButton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  public logout() {
    this.authService.logout();
  }

  public redirect(location: 'create' | 'browse') {
    redirectTo(location, this.router);
  }
}
