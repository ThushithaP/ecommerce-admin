import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from "primeng/button";
import { RoleFormValues, Roles } from '../../dto';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';

@Component({
  selector: 'app-role-form',
  imports: [InputText, Button, ReactiveFormsModule, ToggleButtonModule],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm extends BaseModalFormComponent<Roles, RoleFormValues> {

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      is_active: [true]
    },
  );

  override get f() {
    return this.form.controls;
  }

  protected emptyValues(): RoleFormValues {
    return { name: '', description: '', is_active: true };
  }

  protected recordToValues(record: Roles): RoleFormValues {
    return { name: record.name, description: record.description, is_active: record.is_active };
  }
}
