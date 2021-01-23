import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AbstractGetManyByPathResolver } from './abstract-get-many-by-path.resolver';
import { AbstractRestService } from './abstract-rest.service';

@Injectable({ providedIn: 'root' })
class TestResolver<T> extends AbstractGetManyByPathResolver<T> {
  constructor(r: AbstractRestService<T>) {
    super(r);
  }
}

const routeSnapshot: ActivatedRouteSnapshot = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
routeSnapshot.params = { id: 1 };
let routeState: RouterStateSnapshot;
let restService: jasmine.SpyObj<AbstractRestService<any>>;
let resolver: TestResolver<any>;
let result: Observable<string[]>;

const sharedSetup = () => {
  beforeEach(() => {
    restService = jasmine.createSpyObj('AbstractRestService', ['getManyByPath']);
    resolver = new TestResolver(restService);
    result = new Observable((observer: Observer<string[]>) => {
      observer.next(['a']);
      observer.complete();
    });

    restService.getManyByPath.and.returnValue(result);
  });
};

describe('AbstractGetManyByPathResolver', () => {
  sharedSetup();

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolve properly', () => {
    (resolver.resolve(routeSnapshot, routeState) as Observable<string[]>).subscribe((res) => expect(res).toEqual(['a']));
  });
});
