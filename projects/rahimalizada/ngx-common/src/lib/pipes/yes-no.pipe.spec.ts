import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { YES_NO_PIPE_SETTINGS } from './yes-no-pipe-settings';
import { YesNoPipe } from './yes-no.pipe';

@Component({
  selector: 'selector-name',
  template: `
    <p id="test-paragraph1">{{ value | yesNo }}</p>
    <p id="test-paragraph2">{{ value | yesNo: 'si':'non' }}</p>
    <p id="test-paragraph3">{{ value | yesNo: '1':'0' }}</p>
  `,
})
export class TestComponent implements OnInit {
  value: boolean = false;
  constructor() {}

  ngOnInit() {}
}

describe('YesNoPipe', () => {
  it('create an instance', () => {
    const pipe = new YesNoPipe();
    expect(pipe).toBeTruthy();
  });
});

describe('A component with YesNoPipe', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, YesNoPipe],
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents(); // This is not needed if you are in the CLI context
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should instantiate', () => {
    expect(component).toBeDefined();
  });

  it('should output yes or no depending on the pipe argument', () => {
    expect(getText(fixture, '#test-paragraph1')).toBe('no');
    component.value = false;
    expect(getText(fixture, '#test-paragraph1')).toBe('no');
    component.value = true;
    expect(getText(fixture, '#test-paragraph1')).toBe('yes');
  });

  it('should output si or no depending on the pipe argument', () => {
    component.value = false;
    expect(getText(fixture, '#test-paragraph2')).toBe('non');
    component.value = true;
    expect(getText(fixture, '#test-paragraph2')).toBe('si');
  });

  it('should output 0 or 1 depending on the pipe argument', () => {
    component.value = false;
    expect(getText(fixture, '#test-paragraph3')).toBe('0');
    component.value = true;
    expect(getText(fixture, '#test-paragraph3')).toBe('1');
  });
});

describe('A component with YesNoPipe and setting provided in module', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, YesNoPipe],
        imports: [],
        providers: [{ provide: YES_NO_PIPE_SETTINGS, useValue: { yes: 'да', no: 'нет' } }],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents(); // This is not needed if you are in the CLI context
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should output да or нет depending on the pipe argument', () => {
    component.value = false;
    expect(getText(fixture, '#test-paragraph1')).toBe('нет');
    component.value = true;
    expect(getText(fixture, '#test-paragraph1')).toBe('да');
  });

  it('should output si or no depending on the pipe argument', () => {
    component.value = false;
    expect(getText(fixture, '#test-paragraph2')).toBe('non');
    component.value = true;
    expect(getText(fixture, '#test-paragraph2')).toBe('si');
  });

  it('should output 0 or 1 depending on the pipe argument', () => {
    component.value = false;
    expect(getText(fixture, '#test-paragraph3')).toBe('0');
    component.value = true;
    expect(getText(fixture, '#test-paragraph3')).toBe('1');
  });
});

const getText = (fixture: ComponentFixture<TestComponent>, id: string) => {
  fixture.detectChanges();
  const paragraph = fixture.debugElement.query(By.css(id));
  const text = paragraph.nativeElement.textContent;
  return text;
};
