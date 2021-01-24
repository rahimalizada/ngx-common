import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { ProgressIndicatorInterceptor } from './progress-indicator.interceptor';

let interceptor: ProgressIndicatorInterceptor;
let request: HttpRequest<any>;
let handler: jasmine.SpyObj<HttpHandler>;
let observable: Observable<HttpEvent<unknown>>;
let observer: Observer<HttpEvent<unknown>>;

function sharedSetup() {
  beforeEach(() => {
    request = jasmine.createSpyObj('HttpRequest', ['']);
    handler = jasmine.createSpyObj('HttpHandler', ['handle']);
    observable = new Observable((obs: Observer<HttpEvent<unknown>>) => {
      observer = obs;
      // observer.next(jasmine.createSpyObj('HttpEvent', ['']));
      // observer.complete();
    });
    handler.handle.and.returnValue(observable);
    interceptor = new ProgressIndicatorInterceptor();
  });
}

describe('ProgressIndicatorInterceptor', () => {
  sharedSetup();

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should emit value on http request start and end', () => {
    expect(interceptor.progressSubject.getValue()).toBe(0);
    interceptor.intercept(request, handler).subscribe((val) => {});
    expect(interceptor.progressSubject.getValue()).toBe(1);

    observer.next(jasmine.createSpyObj('HttpEvent', ['']));
    expect(interceptor.progressSubject.getValue()).toBe(1);
    observer.complete();
    expect(interceptor.progressSubject.getValue()).toBe(0);
  });
});
