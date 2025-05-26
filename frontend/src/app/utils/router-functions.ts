import { Router } from '@angular/router';
import { RouteLocations } from '../models/route-locations';

export function redirectTo(location: RouteLocations, router: Router) {
  router.navigate(['/' + location]);
}
