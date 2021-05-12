import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsMatchValidator } from './fields-match-validator';

@Component({
  selector: 'lib-counter',
  template: `<form [formGroup]="form">
    <input name="input1" formControlName="input1" />
    <input name="input2" formControlName="input2" />
  </form>`,
})
export class TestComponent implements OnInit {
  form?: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({ input1: null, input2: null }, { validators: FieldsMatchValidator.get('input1', 'input2') });
  }
}

describe('FieldsMatchValidator', () => {
  it('should create an instance', () => {
    expect(new FieldsMatchValidator()).toBeTruthy();
  });
});

describe('A form with FieldsMatchValidator', () => {
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

  it('should be invalid if fields do not match', () => {
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: 'val1' });
    expect(component.form?.valid).toBeFalsy();

    component.form?.patchValue({ input1: null, input2: 'val2' });
    expect(component.form?.valid).toBeFalsy();

    component.form?.patchValue({ input1: 'val1', input2: 'val2' });
    expect(component.form?.valid).toBeFalsy();
  });

  it('should be valid if fields match', () => {
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: null, input2: null });
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: 'val1', input2: 'val1' });
    expect(component.form?.valid).toBeTruthy();
  });
});
