import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Branches, BranchFormValues } from '@features/branch/dto';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { FormFieldComponent } from "@shared/components/form-field/form-field";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { ToggleSwitch } from "primeng/toggleswitch";

@Component({
  selector: 'app-branch-form',
  imports: [ReactiveFormsModule, FormFieldComponent, Button, InputText, ToggleSwitch],
  templateUrl: './branch-form.html',
  styleUrl: './branch-form.css',
})
export class BranchForm extends BaseModalFormComponent<Branches, BranchFormValues> {
  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      docName: ['', [Validators.required]],
      code: ['',],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      defaultWh: [false,],

    },
  );

  override get f() {
    return this.form.controls;
  }

  protected override emptyValues(): BranchFormValues {
    return { name: '',docName:'', code: '', address: '', city: '', phone: '', email: '',defaultWh:false }
  }
  
  protected override recordToValues(record: Branches): BranchFormValues {
    return { name: record.name,docName:record.docName, code: record.code, address: record.address, city: record.city, phone: record.phone, email: record.email,defaultWh:false }
  }
}
