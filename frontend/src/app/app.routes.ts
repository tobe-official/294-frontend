import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {loginGuard} from './guards/login.guard';
import {BrowseComponent} from './components/browse/browse.component';
import {CreateComponent} from './components/create/create.component';
import {BaseSiteComponent} from './components/base-site/base-site.component';
import {CreditsComponent} from './components/credits/credits.component';
import {ProfileComponent} from './components/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: BaseSiteComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [loginGuard],
    component: BaseSiteComponent,
  },
  {
    path: 'create',
    canActivate: [loginGuard],
    component: CreateComponent,
  },
  {
    path: 'profile',
    canActivate: [loginGuard],
    component: ProfileComponent,
  },
  {
    path: 'browse',
    canActivate: [loginGuard],
    component: BrowseComponent,
  },
  {
    path: 'credits',
    canActivate: [loginGuard],
    component: CreditsComponent,
  }
];
