import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordValidator } from './password-validator';

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
      input1: [null, [PasswordValidator.get()]],
    });
  }
}

describe('PasswordValidator', () => {
  it('should create an instance', () => {
    expect(new PasswordValidator()).toBeTruthy();
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

  it('should be invalid if value is not valid', () => {
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: 'val' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({
      password: true,
      invalidLength: true,
    });

    component.form?.patchValue({ input1: 'aaaaaa' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({
      password: true,
      missingDigit: true,
    });

    component.form?.patchValue({ input1: '111111' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({
      password: true,
      missingCapitalLetter: true,
    });

    component.form?.patchValue({ input1: 'A11111' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({
      password: true,
      missingSmallLetter: true,
    });

    component.form?.patchValue({ input1: 'Ab11111' });
    expect(component.form?.valid).toBeFalsy();
    expect(component.form?.get('input1')?.errors).toEqual({
      password: true,
      missingSpecialCharacter: true,
    });
  });

  it('should be valid if value is valid', () => {
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: null });
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: '@1PassWord' });
    expect(component.form?.valid).toBeTruthy();
    expect(component.form?.get('input1')?.errors).toBeNull();

    component.form?.patchValue({ input1: '/1PassWord' });
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: '.1PassWord' });
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: ',1PassWord' });
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: '\\1PassWord' });
    expect(component.form?.valid).toBeTruthy();

    component.form?.patchValue({ input1: '+1PassWord' });
    expect(component.form?.valid).toBeTruthy();
  });
});
