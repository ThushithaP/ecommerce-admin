import { Component } from '@angular/core';
import { Categories, CategoryFormValues } from '../../dto';
import { AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { getFieldError } from '@shared/utills/form-errors';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, Button, InputText],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm extends BaseModalFormComponent<Categories, CategoryFormValues> {

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    },
  );

  override get f() {
    return this.form.controls;
  }

  override getError(control: AbstractControl) {
    return getFieldError(control);
  }

  protected override recordToValues(record: Categories): CategoryFormValues {
    return { name: record.name, description: record.description };
  }

  protected override emptyValues(): CategoryFormValues {
    return { name: '', description: '' };
  }

}
