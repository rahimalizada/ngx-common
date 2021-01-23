import { HttpHandler, HttpHeaderResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { DateParserInterceptor } from '../../public-api';

const interceptor = new DateParserInterceptor();
let httpRequest: HttpRequest<any>;
let httpHandler: jasmine.SpyObj<HttpHandler>;
let httpResponse: HttpResponse<any>;
let httpResponseResult: Observable<HttpResponse<any>>;
let nonHttpResponseResult: Observable<HttpHeaderResponse>;
const data = {
  id: 1,
  timestamp: '2020-01-01T01:01:01.001Z',
  invalidTimestamp: '2011-05-06',
  user: { name: 'Name', created: '2020-01-01T01:01:01.010Z', logins: ['2020-01-01T01:01:01.100Z', 'Not a date'] },
};
const result = {
  id: 1,
  timestamp: new Date(1577840461001),
  invalidTimestamp: '2011-05-06',
  user: { name: 'Name', created: new Date(1577840461010), logins: [new Date(1577840461100), 'Not a date'] },
};

const sharedSetup = () => {
  beforeEach(() => {
    httpRequest = jasmine.createSpyObj('HttpRequest', ['']);
    httpHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpResponse = new HttpResponse({ body: data });
    httpResponseResult = new Observable((observer: Observer<HttpResponse<any>>) => {
      observer.next(httpResponse);
      observer.complete();
    });
    nonHttpResponseResult = new Observable((observer: Observer<HttpHeaderResponse>) => {
      observer.next(new HttpHeaderResponse());
      observer.complete();
    });

    httpHandler.handle.and.returnValue(httpResponseResult);
  });
};

describe('DateParserInterceptor', () => {
  sharedSetup();

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should not intercept non HttpResponse events', () => {
    httpHandler.handle.and.returnValue(nonHttpResponseResult);
    interceptor.intercept(httpRequest, httpHandler).subscribe((res) => {
      expect(res instanceof HttpHeaderResponse).toBe(true);
    });
  });

  it('should intercept HttpResponse event and convert the dates', () => {
    interceptor.intercept(httpRequest, httpHandler).subscribe((res) => {
      if (res instanceof HttpResponse) {
        expect(res.body.id instanceof Date).toBe(false);
        expect(res.body.timestamp instanceof Date).toBe(true);
        expect(res.body.invalidTimestamp instanceof Date).toBe(false);
        expect(res.body.user.name instanceof Date).toBe(false);
        expect(res.body.user.created instanceof Date).toBe(true);
        expect(res.body.user.logins[0] instanceof Date).toBe(true);
        expect(res.body.user.logins[1] instanceof Date).toBe(false);

        expect(res.body).toEqual(result);
      }
      expect(res instanceof HttpResponse).toBe(true);
    });
  });
});
