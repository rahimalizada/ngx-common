import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PatternValidator {
  static get(regex: RegExp, error: ValidationErrors): ValidatorFn {
    const result = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return regex.test(control.value) ? null : error;
    };
    return result;
  }
}
