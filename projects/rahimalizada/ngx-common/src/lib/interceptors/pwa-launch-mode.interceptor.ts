import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PwaLaunchModeInterceptor implements HttpInterceptor {
  mode = 'undetermined';
  constructor() {
    // https://web.dev/customize-install/
    const nav: any = navigator;
    if (nav.standalone) {
      this.mode = 'installed-ios';
    } else if (matchMedia('(display-mode: standalone)').matches) {
      this.mode = 'installed';
    } else {
      this.mode = 'browser';
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clone = request.clone({
      setHeaders: {
        'X-PWA-Launch-Mode': this.mode,
      },
    });
    return next.handle(clone);
  }
}
