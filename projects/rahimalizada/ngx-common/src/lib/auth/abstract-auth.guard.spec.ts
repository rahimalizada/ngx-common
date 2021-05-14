import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AbstractAuthGuard } from '../../public-api';
import { TestAuthResult, TestAuthService } from './abstract-auth.service.spec';

@Injectable({ providedIn: 'root' })
class TestUserGuard extends AbstractAuthGuard<TestAuthResult> {
  constructor(authService: TestAuthService, r: Router) {
    super(authService, r, 'auth/login');
  }
}

let router: Router;
let routeSnapshot: ActivatedRouteSnapshot;
let service: jasmine.SpyObj<TestAuthService>;
let guard: TestUserGuard;
let authResultObservable: Observable<TestAuthResult>;

function sharedSetup() {
  beforeEach(() => {
    routeSnapshot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
    routeSnapshot.data = {};
    router = jasmine.createSpyObj('Router', ['navigate']);
    service = jasmine.createSpyObj('TestAuthService', ['isLoggedIn', 'renewToken', 'hasAllPermissions', 'hasAnyPermissions']);
    guard = new TestUserGuard(service, router);
    authResultObservable = new Observable((observer: Observer<TestAuthResult>) => {
      observer.next({} as TestAuthResult);
      observer.complete();
    });

    service.isLoggedIn.and.returnValue(true);
    service.renewToken.and.returnValue(authResultObservable);
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
    service.renewToken.and.returnValue(authResultObservable);
    (guard.canActivate(routeSnapshot) as Observable<boolean>).subscribe((res) => expect(res).toBe(false));
  });

  it('should renew token and return logged in state', () => {
    service.isLoggedIn.and.returnValue(false);
    service.renewToken.and.returnValue(authResultObservable);
    (guard.canActivate(routeSnapshot) as Observable<boolean>).subscribe(
      () => undefined,
      (err) => {
        console.log(err);
        expect(err).toBe('error');
      },
    );
  });
});
