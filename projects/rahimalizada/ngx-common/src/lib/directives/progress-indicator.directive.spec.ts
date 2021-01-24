import { TemplateRef, ViewContainerRef } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { ProgressIndicatorDirective } from './progress-indicator.directive';
import { ProgressIndicatorInterceptor } from '../interceptors/progress-indicator.interceptor';

let templateRef: TemplateRef<any>;
let viewContainer: jasmine.SpyObj<ViewContainerRef>;
let router: jasmine.SpyObj<Router>;
let progressSubject = new BehaviorSubject(0);
// let interceptor: jasmine.SpyObj<Router>;
let interceptor: ProgressIndicatorInterceptor;
let directive: ProgressIndicatorDirective;

let navigationObservable: Observable<Event>;
let navigationObserver: Observer<Event>;

// let httpObservable: Observable<HttpEvent<unknown>>;
// let httpObserver: Observer<HttpEvent<unknown>>;

///
// let request: HttpRequest<any>;
// let handler: jasmine.SpyObj<HttpHandler>;
// let observable: Observable<HttpEvent<unknown>>;
//

function sharedSetup() {
  beforeEach(() => {
    templateRef = jasmine.createSpyObj('TemplateRef', ['']);
    viewContainer = jasmine.createSpyObj('ViewContainerRef', [
      'createEmbeddedView',
      'clear',
    ]);
    router = jasmine.createSpyObj('Router', ['events']);
    navigationObservable = new Observable((obs: Observer<Event>) => {
      navigationObserver = obs;
    });
    Object.defineProperty(router, 'events', { value: navigationObservable });

    // httpObservable = new Observable((obs: Observer<HttpEvent<unknown>>) => {
    //   httpObserver = obs;
    //   // observer.next(jasmine.createSpyObj('HttpEvent', ['']));
    //   // observer.complete();
    // });

    progressSubject = new BehaviorSubject(0);
    interceptor = new ProgressIndicatorInterceptor();
    // interceptor = jasmine.createSpyObj('ProgressIndicatorInterceptor', ['']);
    spyOnProperty(interceptor, 'progressSubject', 'get').and.returnValue(
      progressSubject
    );
    directive = new ProgressIndicatorDirective(
      templateRef,
      viewContainer,
      router,
      interceptor
    );
    //

    // request = jasmine.createSpyObj('HttpRequest', ['']);
    // handler = jasmine.createSpyObj('HttpHandler', ['handle']);
    //
    // handler.handle.and.returnValue(observable);
  });
}

describe('ProgressIndicatorDirective', () => {
  sharedSetup();

  it('should add template on navigation event', () => {
    directive.ngProgressIndicator = 'navigation';
    expect(viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    expect(viewContainer.clear).not.toHaveBeenCalled();

    navigationObserver.next(jasmine.createSpyObj('RouterEvent', ['']));
    expect(viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    expect(viewContainer.clear).not.toHaveBeenCalled();

    navigationObserver.next(new NavigationStart(0, ''));
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(1);
    expect(viewContainer.clear).not.toHaveBeenCalled();

    navigationObserver.next(new NavigationStart(0, ''));
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(1);
    expect(viewContainer.clear).not.toHaveBeenCalled();

    navigationObserver.next(new NavigationEnd(0, '', ''));
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(1);
    expect(viewContainer.clear).toHaveBeenCalled();
    expect(viewContainer.clear).toHaveBeenCalledTimes(1);

    navigationObserver.next(new NavigationEnd(0, '', ''));
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(1);
    expect(viewContainer.clear).toHaveBeenCalled();
    expect(viewContainer.clear).toHaveBeenCalledTimes(1);
  });

  it('should add template on http event', async () => {
    directive.ngProgressIndicator = 'http';
    expect(viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    expect(viewContainer.clear).not.toHaveBeenCalled();

    await progressSubject.next(1);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(1);
    expect(viewContainer.clear).not.toHaveBeenCalled();

    await progressSubject.next(3);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(1);
    expect(viewContainer.clear).not.toHaveBeenCalled();

    await progressSubject.next(0);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(1);
    expect(viewContainer.clear).toHaveBeenCalled();
    expect(viewContainer.clear).toHaveBeenCalledTimes(1);

    await progressSubject.next(0);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledTimes(1);
    expect(viewContainer.clear).toHaveBeenCalled();
    expect(viewContainer.clear).toHaveBeenCalledTimes(1);

    directive.ngOnDestroy();
  });
});
