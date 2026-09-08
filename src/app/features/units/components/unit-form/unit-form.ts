import { Component } from '@angular/core';
import { Units, UnitFormValues } from '../../dto';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { Select } from "primeng/select";
import { SelectOption } from '@shared/interfaces';

@Component({
  selector: 'app-unit-form',
  imports: [ReactiveFormsModule, Button, InputText, Select],
  templateUrl: './unit-form.html',
  styleUrl: './unit-form.css',
})
export class UnitForm extends BaseModalFormComponent<Units, UnitFormValues> {

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required]],
      symbol: ['', [Validators.required]],
      code: ['', [Validators.required]],
      // unitType: [null as number | null, [Validators.required]],
      unitType: ['', [Validators.required]],
    },
  );

  override get f() {
    return this.form.controls;
  }
  
  protected emptyValues(): UnitFormValues {
    return { name: '', symbol: '', code: '', unitType: '' };
  }

  protected recordToValues(record: Units): UnitFormValues {
    return { name: record.name, symbol: record.symbol, code: record.code, unitType: record.unitType };
  }

  readonly unitTypes: SelectOption[] = [
    { value: 'weight', name: 'Weight' },
    { value: 'volume', name: 'Volume' },
    { value: 'quantity', name: 'Quantity' },
    { value: 'length', name: 'Length' },
  ];
}
