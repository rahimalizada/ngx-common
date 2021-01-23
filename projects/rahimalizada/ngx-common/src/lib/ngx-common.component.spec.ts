import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCommonComponent } from './ngx-common.component';

describe('NgxCommonComponent', () => {
  let component: NgxCommonComponent;
  let fixture: ComponentFixture<NgxCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
