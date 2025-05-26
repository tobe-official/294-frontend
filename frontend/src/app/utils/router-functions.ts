import { Router } from '@angular/router';

export function redirectTo(
  location: '' | 'create' | 'home' | 'browse',
  router: Router,
) {
  router.navigate(['/' + location]);
}
