import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Modules, ModuleFormValues } from '../../dto';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';

@Component({
  selector: 'app-module-form',
  imports: [ReactiveFormsModule, Button, InputText, ToggleSwitchModule],
  templateUrl: './module-form.html',
  styleUrl: './module-form.css',
})
export class ModuleForm extends BaseModalFormComponent<Modules, ModuleFormValues> {

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required]],
      description: [''],
      // is_active: [true]
    },
  );

  override get f() {
    return this.form.controls;
  }

  protected emptyValues(): ModuleFormValues {
    return { name: '', code: '', description: '' };
  }

  protected recordToValues(record: Modules): ModuleFormValues {
    return { name: record.name, code: record.code, description: record.description };
  }
}
