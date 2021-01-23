import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormComponent } from './abstract-form-component';

@Component({
  selector: 'test-component',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input type="comp" formControlName="comp" />
      <button type="submit">Submit</button>
      <button type="reset">Cancel</button>
    </form>
  `,
})
class TestComponent extends AbstractFormComponent implements OnInit {
  constructor(private fb: FormBuilder) {
    super('Generic error message');
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      component: ['', [Validators.required, Validators.minLength(5)]],
      group: this.fb.group({
        groupElement: ['', [Validators.required, Validators.minLength(5)]],
      }),
      array: this.fb.array([
        this.fb.group({
          arrayElement: ['', [Validators.required, Validators.minLength(5)]],
        }),
      ]),
    });
  }
}

let component: TestComponent;
let fixture: ComponentFixture<TestComponent>;

function sharedSetup() {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [TestComponent],
    });

    // create component and test fixture
    fixture = TestBed.createComponent(TestComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
    component.ngOnInit();
  });
}

describe('AbstractFormComponent', () => {
  sharedSetup();

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should return validity state of a component', () => {
    expect(component.isInvalid('component')).toBe(false);

    component.form.get('component')?.markAsDirty();
    expect(component.isInvalid('component')).toBe(true);
    component.form.get('component')?.markAsPristine();
    expect(component.isInvalid('component')).toBe(false);

    component.form.get('component')?.markAsTouched();
    expect(component.isInvalid('component')).toBe(true);
    component.form.get('component')?.markAsUntouched();
    expect(component.isInvalid('component')).toBe(false);
  });

  it('should return validity state of a group', () => {
    expect(component.isInvalid('groupElement', 'group')).toBe(false);

    component.form.get('group')?.get('groupElement')?.markAsDirty();
    expect(component.isInvalid('groupElement', 'group')).toBe(true);
    component.form.get('group')?.get('groupElement')?.markAsPristine();
    expect(component.isInvalid('groupElement', 'group')).toBe(false);

    component.form.get('group')?.get('groupElement')?.markAsTouched();
    expect(component.isInvalid('groupElement', 'group')).toBe(true);
    component.form.get('group')?.get('groupElement')?.markAsUntouched();
    expect(component.isInvalid('groupElement', 'group')).toBe(false);
  });

  it('should return validity state of an array', () => {
    expect(component.isInvalid('arrayElement', 'array', 0)).toBe(false);

    (component.form.get('array') as FormArray).at(0).get('arrayElement')?.markAsDirty();
    expect(component.isInvalid('arrayElement', 'array', 0)).toBe(true);
    (component.form.get('array') as FormArray).at(0).get('arrayElement')?.markAsPristine();
    expect(component.isInvalid('arrayElement', 'array', 0)).toBe(false);

    (component.form.get('array') as FormArray).at(0).get('arrayElement')?.markAsTouched();
    expect(component.isInvalid('arrayElement', 'array', 0)).toBe(true);
    (component.form.get('array') as FormArray).at(0).get('arrayElement')?.markAsUntouched();
    expect(component.isInvalid('arrayElement', 'array', 0)).toBe(false);
  });

  it('should reset form onCancel', () => {
    component.form.get('component')?.markAsDirty();
    component.errorMessage = 'err';
    component.showSuccessMessage = true;
    expect(component.form.dirty).toBe(true);
    expect(component.errorMessage).toBe('err');
    expect(component.showSuccessMessage).toBe(true);

    component.onCancel();

    expect(component.form.dirty).toBe(false);
    expect(component.errorMessage).toBeNull();
    expect(component.showSuccessMessage).toBe(false);
  });

  it('should modify onSubmit', () => {
    component.submitButtonDisabled = false;
    component.errorMessage = 'err';
    component.showSuccessMessage = true;
    component.form.markAsUntouched();

    expect(component.form.touched).toBe(false);
    expect(component.submitButtonDisabled).toBe(false);
    expect(component.errorMessage).toBe('err');
    expect(component.showSuccessMessage).toBe(true);

    component.onSubmit();

    expect(component.form.get('component')?.touched).toBe(true);
    expect(component.submitButtonDisabled).toBe(true);
    expect(component.errorMessage).toBeNull();
    expect(component.showSuccessMessage).toBe(false);
  });

  it('should handle error properly', () => {
    component.submitButtonDisabled = true;
    expect(component.submitButtonDisabled).toBe(true);

    component.handleError(new HttpErrorResponse({ status: 404, error: 'Not found' }));

    expect(component.submitButtonDisabled).toBe(false);
    expect(component.errorMessage).toBe('Not found');

    component.handleError(new HttpErrorResponse({ status: 500, error: 'Server error' }));
    expect(component.errorMessage).toBe('Generic error message');
  });
});
