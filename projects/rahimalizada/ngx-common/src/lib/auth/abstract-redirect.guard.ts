import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractAuthService } from './abstract-auth.service';

export abstract class AbstractRedirectGuard<T extends { token: string; refreshToken: string; permissions: string[] }>
  implements CanActivate, CanActivateChild
{
  constructor(
    protected authService: AbstractAuthService<T>,
    protected router: Router,
    private loggedInRedirect: string,
    private loggedOutRedirect: string,
  ) {}

  canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
    this.router.navigate([this.authService.isLoggedIn() ? this.loggedInRedirect : this.loggedOutRedirect]);
    return true;
  }

  canActivateChild(): Observable<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate();
  }
}
