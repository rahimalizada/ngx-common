import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AbstractGetOneByPathResolver } from './abstract-get-one-by-path.resolver';
import { AbstractRestService } from './abstract-rest.service';

@Injectable({ providedIn: 'root' })
class TestResolver<T> extends AbstractGetOneByPathResolver<T> {
  constructor(r: AbstractRestService<T>) {
    super(r);
  }
}

const routeSnapshot: ActivatedRouteSnapshot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
routeSnapshot.params = { id: 1 };
let routeState: RouterStateSnapshot;
let restService: jasmine.SpyObj<AbstractRestService<any>>;
let resolver: TestResolver<any>;
let result: Observable<string>;

const sharedSetup = () => {
  beforeEach(() => {
    restService = jasmine.createSpyObj('AbstractRestService', ['getOneByPath']);
    resolver = new TestResolver(restService);
    result = new Observable((observer: Observer<string>) => {
      observer.next('a');
      observer.complete();
    });

    restService.getOneByPath.and.returnValue(result);
  });
};

describe('AbstractGetOneByPathResolver', () => {
  sharedSetup();

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolve properly', () => {
    (resolver.resolve(routeSnapshot, routeState) as Observable<string>).subscribe((res) => expect(res).toEqual('a'));
  });
});
