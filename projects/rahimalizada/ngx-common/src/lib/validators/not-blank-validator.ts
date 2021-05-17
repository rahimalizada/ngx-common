import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class NotBlankValidator {
  static get(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      if (value === undefined || value === null) {
        return { isNull: true };
      }

      const trimmed = value.trim();

      if (trimmed.length < 1) {
        return { isBlank: true };
      }
      return null;
    };
  }
}
