import { AbstractControl } from '@angular/forms';

const DEFAULT_MESSAGES: Record<string, (err: any) => string> = {
    required: () => 'This field is required.',
    minlength: (err) => `Minimum ${err.requiredLength} characters.`,
    maxlength: (err) => `Maximum ${err.requiredLength} characters.`,
    min: (err) => `Minimum value is ${err.min}.`,
    max: (err) => `Maximum value is ${err.max}.`,
    email: () => 'Enter a valid email address.',
    pattern: () => 'Invalid format.',
};

export function getFieldError(
 control: AbstractControl | null,
 customMessages: Record<string, string | ((err: any) => string)> = {}
): string | null {
    if (!control || !control.touched || !control.errors) return null;

    const errorKey = Object.keys(control.errors)[0];   // show first error only
    const err = control.errors[errorKey];

    const custom = customMessages[errorKey];
    if (custom) return typeof custom === 'function' ? custom(err) : custom;

    const fallback = DEFAULT_MESSAGES[errorKey];
    return fallback ? fallback(err) : 'Invalid value.';
}