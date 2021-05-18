import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export class RedirectGuard implements CanActivate, CanActivateChild {
  constructor(protected authService: { isLoggedIn: () => boolean }, protected router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    const loggedInPath = route.data.loggedInPath ?? '/';
    const loggedOutPath = route.data.loggedOutPath ?? '/auth/login';
    return this.router.createUrlTree([this.authService.isLoggedIn() ? loggedInPath : loggedOutPath]);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route);
  }
}
