import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PwaLaunchModeInterceptor } from './pwa-launch-mode.interceptor';

describe('PwaLaunchModeInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: PwaLaunchModeInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should add a header', () => {
    httpClient.get('http://google.com').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('http://google.com');
    expect(httpRequest.request.headers.has('X-PWA-Launch-Mode')).toEqual(true);
    expect(httpRequest.request.headers.get('X-PWA-Launch-Mode')).toEqual(
      'browser'
    );
  });
});
