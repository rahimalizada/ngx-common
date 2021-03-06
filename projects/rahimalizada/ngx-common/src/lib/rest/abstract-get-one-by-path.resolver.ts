import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractRestService } from './abstract-rest.service';

export abstract class AbstractGetOneByPathResolver<T> implements Resolve<T> {
  constructor(private service: AbstractRestService<T>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): T | Observable<T> | Promise<T> {
    return this.service.getOneByPath(route.params.id);
  }
}
