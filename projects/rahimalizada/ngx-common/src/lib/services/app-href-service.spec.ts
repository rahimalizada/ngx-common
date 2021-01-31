import { TestBed } from '@angular/core/testing';
import { AppHrefService } from './app-href-service';

describe('AppHrefService', () => {
  let service: AppHrefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppHrefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have appBaseHref property defined', () => {
    expect(service.appOrigin).not.toBeNull();
    expect(service.appBaseHref).not.toBeNull();

    expect(service.appOrigin).toBe(window.location.origin);
    expect(service.appBaseHref).toBe(window.location.origin + '/');
  });
});
