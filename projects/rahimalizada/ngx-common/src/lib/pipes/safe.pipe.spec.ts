import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By, DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';

@Component({
  selector: 'selector-name',
  template: `
    <p><a id="unsafe" target="_blank" [href]="file.url">Unsafe</a></p>
    <p><a id="safe" target="_blank" [href]="file.url | safe">Safe</a></p>
  `,
})
export class TestComponent implements OnInit {
  file: { blob: Blob; filename: string; url: string };

  link: string = '';
  constructor() {
    const blob = new Blob(['Text'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    this.file = { blob, filename: 'file.txt', url };
  }

  ngOnInit() {}
}

let domSanitizer: jasmine.SpyObj<DomSanitizer>;

describe('SafePipe', () => {
  it('create an instance', () => {
    const pipe = new SafePipe(domSanitizer);
    expect(pipe).toBeTruthy();
  });
});

describe('A component with SafePipe', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, SafePipe],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents(); // This is not needed if you are in the CLI context
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should unsafe value properly', () => {
    expect(getHref(fixture, '#unsafe')).toMatch(/^unsafe:blob:http.*/);
    expect(getHref(fixture, '#safe')).toMatch(/^blob:http.*/);
  });
});

const getHref = (fixture: ComponentFixture<TestComponent>, id: string): string => {
  fixture.detectChanges();
  return fixture.debugElement.query(By.css(id)).nativeElement.href;
};
