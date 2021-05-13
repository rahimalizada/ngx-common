import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AbstractAuthGuard } from '../../public-api';
import { TestAuthService } from './abstract-auth.service.spec';

type AuthResult = { token: string; refreshToken: string; permissions: string[] };

@Injectable({ providedIn: 'root' })
class TestUserGuard<T extends { token: string; refreshToken: string; permissions: string[] }> extends AbstractAuthGuard<T> {
  constructor(authService: TestAuthService<T>, r: Router) {
    super(authService, r, 'auth/login');
  }
}

let router: Router;
let routeSnapshot: ActivatedRouteSnapshot;
let service: jasmine.SpyObj<TestAuthService<any>>;
let guard: TestUserGuard<any>;
let trueObservable: Observable<boolean>;
let falseObservable: Observable<boolean>;
let errorObservable: Observable<boolean>;

function sharedSetup() {
  beforeEach(() => {
    routeSnapshot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
    routeSnapshot.data = {};
    router = jasmine.createSpyObj('Router', ['navigate']);
    service = jasmine.createSpyObj('TestAuthService', ['isLoggedIn', 'renewToken', 'hasAllPermissions', 'hasAnyPermissions']);
    guard = new TestUserGuard(service, router);
    trueObservable = new Observable((observer: Observer<boolean>) => {
      observer.next(true);
      observer.complete();
    });
    falseObservable = new Observable((observer: Observer<boolean>) => {
      observer.next(false);
      observer.complete();
    });
    errorObservable = new Observable((observer: Observer<boolean>) => {
      observer.error('error');
      observer.complete();
    });

    service.isLoggedIn.and.returnValue(true);
    service.renewToken.and.returnValue(trueObservable);
    service.hasAllPermissions.and.returnValue(true);
  });
}

describe('AbstractUserGuard', () => {
  sharedSetup();

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow navigation if logged in', () => {
    expect(guard.canActivate(routeSnapshot)).toBe(true);
    expect(guard.canActivateChild(routeSnapshot)).toBe(true);
  });

  it('should allow navigation if logged in and proper permissions exists', () => {
    routeSnapshot.data = { allPermissions: ['user'] };
    expect(guard.canActivate(routeSnapshot)).toBe(true);
  });

  it('should not allow navigation if logged in and permissions are missing', () => {
    service.hasAllPermissions.and.returnValue(false);
    routeSnapshot.data = { allPermissions: ['user'] };
    expect(guard.canActivate(routeSnapshot)).toBe(false);
  });

  it('should renew token and return logged in state', () => {
    service.isLoggedIn.and.returnValue(false);
    (guard.canActivate(routeSnapshot) as Observable<boolean>).subscribe((res) => expect(res).toBe(false));
  });

  it('should renew token and return logged in state', () => {
    service.isLoggedIn.and.returnValue(false);
    service.renewToken.and.returnValue(falseObservable);
    (guard.canActivate(routeSnapshot) as Observable<boolean>).subscribe((res) => expect(res).toBe(false));
  });

  it('should renew token and return logged in state', () => {
    service.isLoggedIn.and.returnValue(false);
    service.renewToken.and.returnValue(errorObservable);
    (guard.canActivate(routeSnapshot) as Observable<boolean>).subscribe(
      () => undefined,
      (err) => {
        console.log(err);
        expect(err).toBe('error');
      },
    );
  });
});
