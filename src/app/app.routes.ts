import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { loginGuard } from './guards/login.guard';

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
  // {
  //   path: 'blog/:blogId',
  //   canActivate: [loginGuard],
  //   component: BlogComponent
  // },
  // {
  //   path: 'profile/:userId',
  //   canActivate: [
  //     loginGuard
  //   ],
  //   component: ProfileComponent
  // }
];
