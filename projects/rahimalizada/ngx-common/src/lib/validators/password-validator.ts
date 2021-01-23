import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
  private static readonly DIGIT_REGEXP = new RegExp('\\d');
  private static readonly CAPITAL_LETTER_REGEXP = new RegExp('[A-Z]');
  private static readonly SMALL_LETTER_REGEXP = new RegExp('[a-z]');
  private static readonly SPECIAL_CHAR_REGEXP = new RegExp(
    '[\\\\/=!@#$%^&(){}\\[\\]:;<>,.?~_+-]'
  );

  static get(
    options: {
      minLength: number;
      requireDigit?: boolean;
      requireCapitalLetter?: boolean;
      requireSmallLetter?: boolean;
      requireSpecialCharacter?: boolean;
    } = {
      minLength: 6,
      requireDigit: true,
      requireCapitalLetter: true,
      requireSmallLetter: true,
      requireSpecialCharacter: true,
    }
  ): ValidatorFn {
    const result = (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      if (value.length < options.minLength) {
        return { password: true, invalidLength: true };
      }

      if (options.requireDigit && !this.DIGIT_REGEXP.test(value)) {
        return { password: true, missingDigit: true };
      }

      if (
        options.requireCapitalLetter &&
        !this.CAPITAL_LETTER_REGEXP.test(value)
      ) {
        return { password: true, missingCapitalLetter: true };
      }

      if (options.requireSmallLetter && !this.SMALL_LETTER_REGEXP.test(value)) {
        return { password: true, missingSmallLetter: true };
      }

      if (
        options.requireSpecialCharacter &&
        !this.SPECIAL_CHAR_REGEXP.test(value)
      ) {
        return { password: true, missingSpecialCharacter: true };
      }

      // return regex.test(control.value) ? null : { errs: true };
      return null;
    };
    return result;
  }
}
