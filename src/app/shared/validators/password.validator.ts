import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Enforces upper/lower/number/special char complexity */
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    const valid = hasUpper && hasLower && hasNumber && hasSpecial;
    return valid ? null : { weakPassword: { hasUpper, hasLower, hasNumber, hasSpecial } };
  };
}

/** Cross-field validator applied at the FormGroup level */
export function passwordsMatchValidator(
  passwordKey = 'password',
  confirmKey = 'confirmPassword'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;

    if (!confirm) return null; // let 'required' handle empty case

    const mismatch = password !== confirm;
    // Set error directly on the control so the template can read it locally
    group.get(confirmKey)?.setErrors(mismatch ? { passwordMismatch: true } : null);
    return mismatch ? { passwordMismatch: true } : null;
  };
}