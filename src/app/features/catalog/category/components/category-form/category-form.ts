import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Categories, CategoryFormValues } from '../../dto';
import { FormMode } from '@shared/types';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, Button, InputText],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  cancel = output<void>();
  save = output<CategoryFormValues>();

  mode = input<FormMode>('create');
  category = input<Categories | null>(null);

  private readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    },
  );

  constructor() {
    effect(() => {
      const category = this.category();
      const mode = this.mode();

      this.submitting.set(false);
      this.serverError.set(null);

      if(category) {
        this.form.reset({
          name:category.name,
          description:category.description,
        })
      } else {
        this.form.reset({
          name:'',
          description:'',
        });
      }
      mode==='view' ? this.form.disable() : this.form.enable();
    })
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void{
    if(this.mode()==='view') {
      return
    }
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.serverError.set(null);
    this.submitting.set(true);

    const values = this.form.getRawValue() as CategoryFormValues;
    this.save.emit(values);
  }
}
