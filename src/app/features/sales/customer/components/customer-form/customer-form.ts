import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerFormValues, CustomerPayload, Customers } from '@features/sales/customer/dto';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { FormFieldComponent } from "@shared/components/form-field/form-field";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { DatePicker } from "primeng/datepicker";
import { formatedDate } from '@shared/utills';

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, FormFieldComponent, Button, InputText, DatePicker],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css',
})
export class CustomerForm extends BaseModalFormComponent<Customers, CustomerFormValues, CustomerPayload> {

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['',],
    dob: [null as Date | null],
  })

  override get f() {
    return this.form.controls;
  }

  protected emptyValues(): CustomerFormValues {
    return { name: '', email: '', phone: '', dob: null };
  }

  protected recordToValues(record: Customers): CustomerFormValues {
    return { name: record.name, email: record.email, phone: record.phone, dob: record.dob ? new Date(record.dob) : null };
  }

  protected override toPayload(raw: CustomerFormValues): CustomerPayload {
    return {
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      dob: raw.dob ? formatedDate(raw.dob) : null,   // Date -> 'YYYY-MM-DD' string, for the API
    };
  }
}
