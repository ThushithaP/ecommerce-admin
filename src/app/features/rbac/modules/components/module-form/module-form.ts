import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormMode } from '@shared/types';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Module, ModuleFormValues } from '../../dto';

@Component({
  selector: 'app-module-form',
  imports: [ReactiveFormsModule, Button, InputText, ToggleSwitchModule],
  templateUrl: './module-form.html',
  styleUrl: './module-form.css',
})
export class ModuleForm {
  cancel = output<void>();
  save = output<ModuleFormValues>();

  mode = input<FormMode>('create');
  module = input<Module | null>(null)

  private readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['',[Validators.required]],
      description: [''],
      // is_active: [true]
    },
  );

  constructor() {
    effect(() => {
      const module = this.module();
      const mode = this.mode();

      this.submitting.set(false);
      this.serverError.set(null);

      if(module) {
        this.form.reset({
          name:module.name,
          code:module.code,
          description:module.description,
          // is_active:module.is_active
        })
      } else {
        this.form.reset({
          name:'',
          code:'',
          description:'',
          // is_active:true
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

    const values = this.form.getRawValue() as ModuleFormValues;
    this.save.emit(values);
  }
}
