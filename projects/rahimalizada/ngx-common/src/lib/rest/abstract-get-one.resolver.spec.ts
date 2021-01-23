import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AbstractGetOneResolver } from './abstract-get-one.resolver';
import { AbstractRestService } from './abstract-rest.service';

@Injectable({ providedIn: 'root' })
class TestResolver<T> extends AbstractGetOneResolver<T> {
  constructor(r: AbstractRestService<T>) {
    super(r);
  }
}

let routeSnapshot: ActivatedRouteSnapshot;
let routeState: RouterStateSnapshot;
let restService: jasmine.SpyObj<AbstractRestService<any>>;
let resolver: TestResolver<any>;
let result: Observable<string>;

const sharedSetup = () => {
  beforeEach(() => {
    restService = jasmine.createSpyObj('AbstractRestService', ['getOne']);
    resolver = new TestResolver(restService);
    result = new Observable((observer: Observer<string>) => {
      observer.next('a');
      observer.complete();
    });

    restService.getOne.and.returnValue(result);
  });
};

describe('AbstractGetOneResolver', () => {
  sharedSetup();

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolve properly', () => {
    (resolver.resolve(routeSnapshot, routeState) as Observable<string>).subscribe((res) => expect(res).toEqual('a'));
  });
});
