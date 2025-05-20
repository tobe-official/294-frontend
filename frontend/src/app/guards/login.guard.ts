import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = () => {
  return inject(AuthService).isLoggedIn();
};
