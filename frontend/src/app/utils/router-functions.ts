import { Router } from '@angular/router';

export function redirectTo(
  location: '' | 'create' | 'home' | 'browse' | 'login' | 'credits',
  router: Router,
) {
  router.navigate(['/' + location]).then(r => r);
}
