import { Component } from '@angular/core';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from "primeng/inputtext";
import { Button } from "primeng/button";
import { ShippingMethodFormValues, ShippingMethods } from '../dto';
import { FormFieldComponent } from "@shared/components/form-field/form-field";

@Component({
  selector: 'app-shipping-method-form',
  imports: [ReactiveFormsModule, FormFieldComponent, InputText, Button],
  templateUrl: './shipping-method-form.html',
  styleUrl: './shipping-method-form.css',
})
export class ShippingMethodForm extends BaseModalFormComponent<ShippingMethods,ShippingMethodFormValues>{
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['',],
    flatRate: [null as number | null, [Validators.required]],
    freeAboveAmount: [null as number | null, [Validators.required]],
    estimatedDaysMin: [null as number | null, [Validators.required]],
    estimatedDaysMax: [null as number | null, [Validators.required]],
  })
  
  override get f() {
    return this.form.controls;
  }

  protected override emptyValues(): ShippingMethodFormValues {
    return{name:'',description:'',flatRate:0,freeAboveAmount:0,estimatedDaysMin:0,estimatedDaysMax:0}
  }
  
  protected override recordToValues(record: ShippingMethods): ShippingMethodFormValues {
    return{name:record.name, description:record.description, flatRate:record.flatRate ,freeAboveAmount:record.freeAboveAmount ,estimatedDaysMin:record.estimatedDaysMin ,estimatedDaysMax:record.estimatedDaysMax }
  }
}
