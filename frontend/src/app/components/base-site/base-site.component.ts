import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {redirectTo} from '../../utils/router-functions';
import {RouteLocations} from '../../models/route-locations';
import {AuthService} from '../../services/auth/auth.service';
import {HeaderComponent} from '../header/header.component';
import {TranslatePipe} from '@ngx-translate/core';
import {RecordModel} from "pocketbase";
import {CheatsheetService} from "../../services/cheatsheet/cheatsheet.service";

@Component({
    selector: 'app-base-site',
    standalone: true,
    imports: [MatButton, HeaderComponent, TranslatePipe],
    templateUrl: './base-site.component.html',
    styleUrl: './base-site.component.scss',
})
export class BaseSiteComponent {
    public user: RecordModel;
    public topCheatSheets: RecordModel[] = [];
    private emptyUser: RecordModel = {
        id: '',
        collectionId: '',
        collectionName: '',
    };

    constructor(
        private router: Router,
        private authService: AuthService,
        private cheatSheetService: CheatsheetService
    ) {
        const loggedInUser: RecordModel | null = this.authService.getLoggedInUser();
        this.user = loggedInUser ?? this.emptyUser;

        this.cheatSheetService.getTopFourCheatSheets().then((sheets) => {
            this.topCheatSheets = sheets;
        });
    }

    public get isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    public redirect(location: RouteLocations): void {
        redirectTo(this.isLoggedIn ? location : 'login', this.router);
    }

    public get loginButtonLabel(): string {
        return this.isLoggedIn
            ? 'header.logoutButtonLabel'
            : 'header.loginButtonLabel';
    }
}
