import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DateParserInterceptor implements HttpInterceptor {
  private dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)$/;
  private utcDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.convertDates(event.body);
        }
      }),
    );
  }

  private convertDates(object: any) {
    if (!object || !(object instanceof Object)) {
      return;
    }

    if (object instanceof Array) {
      for (const item of object) {
        this.convertDates(item);
      }
    }

    for (const key of Object.keys(object)) {
      const value = object[key];

      if (value instanceof Array) {
        for (const item of value) {
          this.convertDates(item);
        }
      }

      if (value instanceof Object) {
        this.convertDates(value);
      }

      if (typeof value === 'string' && this.utcDateRegex.test(value)) {
        object[key] = new Date(value);
      }
    }
  }
}
