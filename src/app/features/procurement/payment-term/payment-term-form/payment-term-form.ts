import { Component, inject } from '@angular/core';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { PaymentTermFormValues, PaymentTerms } from '../dto';
import { PayementTermService } from '../services/payement-term.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormFieldComponent } from "@shared/components/form-field/form-field";

@Component({
  selector: 'app-payment-term-form',
  imports: [ReactiveFormsModule, Button, InputText, FormFieldComponent],
  templateUrl: './payment-term-form.html',
  styleUrl: './payment-term-form.css',
})
export class PaymentTermForm extends BaseModalFormComponent<PaymentTerms, PaymentTermFormValues> {
  private service = inject(PayementTermService);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    days: [0, [Validators.required]],
    description: [''],
  });

  override get f() {
    return this.form.controls;
  }

  protected override emptyValues(): PaymentTermFormValues {
    return { name: '', days: 0, description: '' }
  }

  protected override recordToValues(record: PaymentTerms): PaymentTermFormValues {
    return { name: record.name, days: record.days, description: record.description }
  }
}
