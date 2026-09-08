import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

export function emailTakenValidator(debounceMs = 400): AsyncValidatorFn {
  const authService = inject(AuthService);

  return (control: AbstractControl): import('rxjs').Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return timer(debounceMs).pipe(
      switchMap(() => authService.checkEmailAvailable(control.value)),
      map((isAvailable) => (isAvailable ? null : { emailTaken: true })),
      catchError(() => of(null)) // fail open — don't block submission on network error
    );
  };
}