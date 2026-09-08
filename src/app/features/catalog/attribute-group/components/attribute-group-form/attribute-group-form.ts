import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AttributeGroups, AttributeGroupFormValues } from '../../dto';
import { FormMode } from '@shared/types';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';

@Component({
  selector: 'app-attribute-group-form',
  imports: [ReactiveFormsModule, Button, InputText],
  templateUrl: './attribute-group-form.html',
  styleUrl: './attribute-group-form.css',
})
export class AttributeGroupForm extends BaseModalFormComponent<AttributeGroups,AttributeGroupFormValues> {
  // cancel = output<void>();
  // save = output<AttributeGroupFormValues>();

  // mode = input<FormMode>('create');
  // record = input<AttributeGroups | null>(null)

  // private readonly fb = inject(FormBuilder);
  // readonly submitting = signal(false);
  // readonly serverError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      sortOrder: [0],
    },
  );

  // constructor() {
  //   effect(() => {
  //     const record = this.record();
  //     const mode = this.mode();

  //     this.submitting.set(false);
  //     this.serverError.set(null);

  //     if (record) {
  //       this.form.reset({
  //         name: record.name,
  //         sortOrder: record.sortOrder,
  //       })
  //     } else {
  //       this.form.reset({
  //         name: '',
  //         sortOrder: 0,
  //       });
  //     }
  //     mode === 'view' ? this.form.disable() : this.form.enable();
  //   })
  // }

  override get f() {
    return this.form.controls;
  }

  protected emptyValues(): AttributeGroupFormValues {
      return { name: '', sortOrder: 0 };
    }
  
    protected recordToValues(record: AttributeGroups): AttributeGroupFormValues {
      return { name: record.name, sortOrder: record.sortOrder};
    }

  // onSubmit(): void {
  //   if (this.mode() === 'view') {
  //     return
  //   }
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }
  //   this.serverError.set(null);
  //   this.submitting.set(true);

  //   const values = this.form.getRawValue() as AttributeGroupFormValues;
  //   this.save.emit(values);
  // }

  // onCancel(): void {
  //   this.serverError.set(null);
  //   this.submitting.set(false);
  //   this.form.reset({
  //     name: '',
  //     sortOrder: 0,
  //   });
  //   this.cancel.emit()
  // }
}
