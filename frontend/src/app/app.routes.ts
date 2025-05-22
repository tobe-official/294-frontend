import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { loginGuard } from './guards/login.guard';
import { BrowseComponent } from './components/browse/browse.component';
import { CreateComponent } from './components/create/create.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [loginGuard],
    component: HomeComponent,
  },
  {
    path: 'create',
    canActivate: [loginGuard],
    component: CreateComponent,
  },
  {
    path: 'browse',
    canActivate: [loginGuard],
    component: BrowseComponent,
  },
];
