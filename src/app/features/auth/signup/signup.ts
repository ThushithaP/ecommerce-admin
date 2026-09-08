// import { Component, inject } from '@angular/core';
// import { ButtonModule } from 'primeng/button';
// import { IconFieldModule } from 'primeng/iconfield';
// import { InputIconModule } from 'primeng/inputicon';
// import { PasswordModule } from 'primeng/password';
// import { CheckboxModule } from 'primeng/checkbox';
// import { DividerModule } from 'primeng/divider';
// import { RouterLink } from '@angular/router';
// import { AuthLayout } from "../auth-layout/auth-layout";
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-signup',
//   imports: [ButtonModule, IconFieldModule, InputIconModule, PasswordModule, CheckboxModule, DividerModule, RouterLink, AuthLayout, ReactiveFormsModule],
//   templateUrl: './signup.html',
//   styleUrl: './signup.css',
// })
// export class Signup {
//   private fb = inject(FormBuilder);

//   signupForm = this.fb.group({
//     fullName: ['', [Validators.required, Validators.minLength(3)]],
//     email: ['', [
//       Validators.required,
//       Validators.email
//     ]],

//     password: ['', [
//       Validators.required,
//       Validators.minLength(8)
//     ]],

//     confirmPassword: ['', [
//       Validators.required
//     ]],

//     terms: [false, Validators.requiredTrue]
//   })


//   submit() {
//     if (this.signupForm.invalid) {
//       this.signupForm.markAllAsTouched();
//       return;
//     }

//     console.log(this.signupForm.value);

//   }


//   public get f() {
//     return this.signupForm.controls;
//   }

// }


import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { strongPasswordValidator, passwordsMatchValidator } from '../../../shared/validators/password.validator';
import { emailTakenValidator } from '../../../shared/validators/email-taken.validator';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthBanner } from "../auth-banner/auth-banner";

interface SignupFormValue {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

@Component({
  selector: 'app-signup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    PasswordModule,
    CheckboxModule,
    DividerModule,
    RouterLink,
    ReactiveFormsModule,
    AuthBanner
],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // UI state as signals — no manual subscriptions/unsubscribes needed for these
  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly signupForm = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [emailTakenValidator()],
          updateOn: 'blur' as const, // don't hammer the API on every keystroke
        },
      ],
      password: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, Validators.requiredTrue],
    },
    { validators: passwordsMatchValidator() }
  );

  get f() {
    return this.signupForm.controls;
  }

  submit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);

    const { fullName, email, password } = this.signupForm.getRawValue() as SignupFormValue;

    this.authService
      .signup({ fullName, email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (err) => {
          this.submitting.set(false);
          this.serverError.set(this.resolveErrorMessage(err));
        },
      });
  }

  continueWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  private resolveErrorMessage(err: unknown): string {
    if (err instanceof Object && 'status' in err && (err as { status: number }).status === 409) {
      return 'An account with this email already exists.';
    }
    return 'Something went wrong. Please try again.';
  }
}