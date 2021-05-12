import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatternValidator } from './pattern-validator';

@Component({
  selector: 'lib-counter',
  template: `<form [formGroup]="form">
    <input name="input1" formControlName="input1" />
  </form>`,
})
export class TestComponent implements OnInit {
  form?: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      input1: [null, [PatternValidator.get(/\d/, { err: true })]],
    });
  }
}

describe('PatternValidator', () => {
  it('should create an instance', () => {
    expect(new PatternValidator()).toBeTruthy();
  });
});

describe('A form with PasswordValidator component', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [FormsModule, ReactiveFormsModule],
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

  it('should be invalid if pattern does not match', () => {
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: 'val' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({ err: true });
  });

  it('should be valid if pattern match', () => {
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: null });
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: 'val1' });
    expect(component.form?.valid).toBeTruthy();
    expect(component.form?.get('input1')?.errors).toBeNull();
  });
});
