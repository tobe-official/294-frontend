import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {Router} from '@angular/router';
import {redirectTo} from '../../utils/router-functions';
import {TranslatePipe} from '@ngx-translate/core';
import {MatToolbar} from "@angular/material/toolbar";

@Component({
    selector: 'app-base-site',
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
    ) {
    }

    public redirect() {
        redirectTo('login', this.router);
    }
}
