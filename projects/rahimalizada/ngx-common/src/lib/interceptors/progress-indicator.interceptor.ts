import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProgressIndicatorInterceptor implements HttpInterceptor {
  private progress = new BehaviorSubject(0);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.progress.next(this.progress.value + 1);
    return next.handle(request).pipe(
      finalize(() => {
        this.progress.next(
          this.progress.value < 1 ? 0 : this.progress.value - 1
        );
      })
    );
  }

  get progressSubject() {
    return this.progress;
  }
}
