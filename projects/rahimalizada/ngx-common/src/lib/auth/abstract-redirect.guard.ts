import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export abstract class AbstractRedirectGuard implements CanActivate, CanActivateChild {
  constructor(private authService: { isLoggedIn: () => boolean }, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    const loggedInPath = route.data.loggedInPath ?? '/';
    const loggedOutPath = route.data.loggedOutPath ?? '/auth/login';
    return this.router.createUrlTree([this.authService.isLoggedIn() ? loggedInPath : loggedOutPath]);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route);
  }
}
