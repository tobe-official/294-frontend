import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {redirectTo} from '../../utils/router-functions';
import {TranslatePipe} from '@ngx-translate/core';
import {MatToolbar} from '@angular/material/toolbar';
import {RouteLocations} from '../../models/route-locations';
import {AuthService} from '../../services/auth/auth.service';

@Component({
    selector: 'app-base-site',
    standalone: true,
    imports: [
        MatButton,
        TranslatePipe,
        MatToolbar
    ],
    templateUrl: './base-site.component.html',
    styleUrl: './base-site.component.scss'
})
export class BaseSiteComponent {

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
    }

    public get loginButtonLabel(): string {
        return this.isLoggedIn() ? 'header.logoutButtonLabel' : 'header.loginButtonLabel';
    }

    public redirect(location: RouteLocations, isLogout: boolean): void {
        if (isLogout) this.logout();
        else redirectTo(this.isLoggedIn() ? location : 'login', this.router);
    }

    public logout(): void {
        this.authService.logout().then(() => {
            redirectTo('', this.router);
        });
    }

    public isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
}
