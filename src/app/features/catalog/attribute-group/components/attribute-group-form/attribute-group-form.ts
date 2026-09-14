import { Component } from '@angular/core';
import { AttributeGroups, AttributeGroupFormValues } from '../../dto';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';

@Component({
  selector: 'app-attribute-group-form',
  imports: [ReactiveFormsModule, Button, InputText],
  templateUrl: './attribute-group-form.html',
  styleUrl: './attribute-group-form.css',
})
export class AttributeGroupForm extends BaseModalFormComponent<AttributeGroups, AttributeGroupFormValues> {

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      sortOrder: [0],
    },
  );

  override get f() {
    return this.form.controls;
  }

  protected emptyValues(): AttributeGroupFormValues {
    return { name: '', sortOrder: 0 };
  }

  protected recordToValues(record: AttributeGroups): AttributeGroupFormValues {
    return { name: record.name, sortOrder: record.sortOrder };
  }

}
