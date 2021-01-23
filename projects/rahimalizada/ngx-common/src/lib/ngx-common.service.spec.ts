import { TestBed } from '@angular/core/testing';

import { NgxCommonService } from './ngx-common.service';

describe('NgxCommonService', () => {
  let service: NgxCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
