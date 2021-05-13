import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractAuthService } from './abstract-auth.service';

export abstract class AbstractAuthGuard<T extends { token: string; refreshToken: string; permissions: string[] }>
  implements CanActivate, CanActivateChild
{
  constructor(protected authService: AbstractAuthService<T>, protected router: Router, private tokenRenewalFailRedirect: string) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.authService.renewToken().pipe(
        map(
          () => this.authService.isLoggedIn(),
          () => {
            this.router.navigate([this.tokenRenewalFailRedirect]);
            return false;
          },
        ),
      );
    }

    if (route.data.allPermissions && !this.authService.hasAllPermissions(route.data.allPermissions)) {
      console.log(`To perform this operation this account lacks all required permissions '${route.data.allPermissions}'`);
      return false;
    } else if (route.data.anyPermissions && !this.authService.hasAnyPermissions(route.data.anyPermissions)) {
      console.log(`To perform this operation this account lacks any required permissions '${route.data.anyPermissions}'`);
      return false;
    }

    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute);
  }
}
