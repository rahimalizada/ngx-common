import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotBlankValidator } from './not-blank-validator';

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
      input1: [null, [NotBlankValidator.get()]],
    });
  }
}

describe('NotBlankValidator', () => {
  it('should create an instance', () => {
    expect(new NotBlankValidator()).toBeTruthy();
  });
});

describe('A form with NotBlankValidator component', () => {
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

  it('should be invalid if value is not valid', () => {
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({ isNull: true });

    component.form?.patchValue({ input1: ' ' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({ isBlank: true });

    component.form?.patchValue({ input1: '  ' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({ isBlank: true });

    component.form?.patchValue({ input1: ' ' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({ isBlank: true });

    component.form?.patchValue({ input1: '  \n \t \r ' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({ isBlank: true });
  });

  it('should be valid if value is valid', () => {
    expect(component.form?.valid).toBeFalsy();

    component.form?.patchValue({ input1: '-' });
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: ' - ' });
    expect(component.form?.valid).toBeTruthy();
  });
});
