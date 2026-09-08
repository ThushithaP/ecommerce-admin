import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button, ButtonDirective } from "primeng/button";
import { Role, RoleFormValues } from '../../dto';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormMode } from '@shared/types';

@Component({
  selector: 'app-role-form',
  imports: [InputText, Button, ButtonDirective, ReactiveFormsModule, ToggleButtonModule],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm {
  cancel = output<void>();
  save = output<RoleFormValues>()

  mode = input<FormMode>('create');
  role = input<Role | null>(null);

  private readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly roleForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      is_active: [true]
    },
  );

  constructor() {
    effect(() => {
      const role = this.role();
      const mode = this.mode();

      this.submitting.set(false);
      this.serverError.set(null);

      if (role) {
        this.roleForm.reset({
          name: role.name,
          description: role.description ?? '',
          is_active: role.is_active,
        });
      } else {
        this.roleForm.reset({
          name: '',
          description: '',
          is_active: true,
        });
      }

      if (mode === 'view') {
        this.roleForm.disable();
      } else {
        this.roleForm.enable();
      }
    });
  }

  get f() {
    return this.roleForm.controls;
  }

  onSubmit(): void {
    if (this.mode() === 'view') {
      return;
    }
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);

    const values = this.roleForm.getRawValue() as RoleFormValues;
    this.save.emit(values);
  }
}
