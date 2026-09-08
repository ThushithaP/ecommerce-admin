import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ModuleService } from '@features/rbac/modules/service/module.service';
import { Module } from '@features/rbac/modules/dto';
import { SelectModule } from 'primeng/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePermissionDto, Permission, PermissionAction, PermissionFormValues, UpdatePermissionDto } from '../../dto';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormMode } from '@shared/types';
import { Button } from "primeng/button";

@Component({
  selector: 'app-permission-form',
  imports: [SelectModule, MultiSelectModule, ReactiveFormsModule, Button],
  templateUrl: './permission-form.html',
  styleUrl: './permission-form.css',
})
export class PermissionForm {
  cancel = output<void>();
  save = output<CreatePermissionDto | UpdatePermissionDto>();

  mode = input<FormMode>('create');;
  record = input<Permission | null>(null);

  private readonly moduleService = inject(ModuleService);
  private readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly modules = signal<Module[]>([]);

  readonly actions: PermissionAction[] = [
    { value: 'view', name: 'View' },
    { value: 'create', name: 'Create' },
    { value: 'update', name: 'Update' },
    { value: 'delete', name: 'Delete' },
    { value: 'export', name: 'Export' },
    { value: 'approve', name: 'Approve' },
  ];

  readonly form = this.fb.nonNullable.group({
    module: ['', Validators.required],
    action: [''],
    actions: this.fb.nonNullable.control<string[]>([]),

  });

  // constructor() {
  //   effect(() => {
  //     const record = this.record();
  //     const mode = this.mode();

  //     this.submitting.set(false);
  //     this.serverError.set(null);

  //     // Reset first
  //     this.form.reset({
  //       module: record?.module ?? '',
  //       action: record?.action ?? '',
  //       actions: [],
  //     });

  //     // Clear validators
  //     this.form.controls.action.clearValidators();
  //     this.form.controls.actions.clearValidators();

  //     if (mode === 'create') {
  //       this.form.controls.actions.setValidators(Validators.required);
  //     }

  //     if (mode === 'edit') {
  //       this.form.controls.action.setValidators(Validators.required);
  //     }

  //     this.form.controls.action.updateValueAndValidity();
  //     this.form.controls.actions.updateValueAndValidity();

  //     if (mode === 'view') {
  //       this.form.disable();
  //     } else {
  //       this.form.enable();
  //     }
  //   });
  // }

  constructor() {
  let lastId: string | null | undefined = undefined;

  // Handle record changes
  effect(() => {
    const record = this.record();
    const currentId = record?.id ?? null;

    if (currentId !== lastId) {
      lastId = currentId;

      this.form.reset({
        module: record?.module ?? '',
        action: record?.action ?? '',
        actions: [],
      });

      this.submitting.set(false);
      this.serverError.set(null);
    }
  });

  // Handle mode changes
  effect(() => {
    const mode = this.mode();

    // Clear existing validators
    this.form.controls.action.clearValidators();
    this.form.controls.actions.clearValidators();

    // Apply validators based on mode
    if (mode === 'create') {
      this.form.controls.actions.setValidators(Validators.required);
    } else if (mode === 'edit') {
      this.form.controls.action.setValidators(Validators.required);
    }

    // Recalculate validation
    this.form.controls.action.updateValueAndValidity();
    this.form.controls.actions.updateValueAndValidity();

    // Enable / disable form
    if (mode === 'view') {
      this.form.disable();
    } else {
      this.form.enable();
    }
  });
}

  fetchModule(): void {
    this.moduleService.list().subscribe({
      next: (res) => {
        this.modules.set(res.results);
      },
      error: () => {
        // this.toast.error('Failed to retrieve.');
      }
    })
  }

  ngOnInit(): void {
    this.fetchModule();
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.mode() === 'view') {
      return
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.serverError.set(null);
    this.submitting.set(true);

    const { module, action, actions } = this.form.getRawValue();

    if (this.mode() === 'create') {
      const payload: CreatePermissionDto = {
        module,
        actions,
      };

      this.save.emit(payload);
      return;
    }

    if (this.mode() === 'edit') {
      const payload: UpdatePermissionDto = {
        module,
        action,
      };

      this.save.emit(payload);
    }
  }
}
