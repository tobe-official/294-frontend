import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {Router} from '@angular/router';
import {redirectTo} from '../../utils/router-functions';

@Component({
  selector: 'app-base-site',
    imports: [
        MatButton
    ],
  templateUrl: './base-site.component.html',
  styleUrl: './base-site.component.scss'
})
export class BaseSiteComponent {
  constructor(
    private router: Router,
  ) {}

  public redirect(location:  'login' | 'home' | 'credits') {
    redirectTo(location, this.router);
  }
}
