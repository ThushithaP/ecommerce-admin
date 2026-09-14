import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { getFieldError } from '@shared/utills/form-errors';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { TaxRateService } from '../services/tax-rate.service';
import { TaxClasses, TaxClassFormValues, TaxRate } from '../dto';

type RateGroup = FormGroup<{
  id: FormControl<number | null>;
  name: FormControl<string>;
  rate: FormControl<number>;
  region: FormControl<string>;
  is_active: FormControl<boolean>;
}>;

@Component({
  selector: 'app-tax-class-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputText, TextareaModule, Button, ToggleSwitch],
  templateUrl: './tax-class-form.html',
  styleUrl: './tax-class-form.css',
})
export class TaxClassForm extends BaseModalFormComponent<TaxClasses, TaxClassFormValues> implements OnInit {
  private readonly taxRateService = inject(TaxRateService);
  readonly savingRates = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    is_active: [true],
    rates: this.fb.array<RateGroup>([]),
  });

  override get f() {
    return this.form.controls;
  }

  get ratesArray(): FormArray<RateGroup> {
    return this.form.controls.rates;
  }

  override getError(control: any) {
    return getFieldError(control);
  }

  private createRate(rate?: Partial<TaxRate>): RateGroup {
    return this.fb.group({
      id: this.fb.control<number | null>(rate?.id ?? null),
      name: this.fb.nonNullable.control(rate?.name ?? '', [Validators.required]),
      rate: this.fb.nonNullable.control(rate?.rate ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]),
      region: this.fb.nonNullable.control(rate?.region ?? ''),
      is_active: this.fb.nonNullable.control(rate?.is_active ?? true),
    }) as RateGroup;
  }

  addRate(): void {
    this.ratesArray.push(this.createRate());
  }

  removeRateAt(index: number): void {
    const control = this.ratesArray.at(index);
    const id = control.value.id;

    if (!id) {
      // never saved — just drop it locally
      this.ratesArray.removeAt(index);
      return;
    }

    this.taxRateService.delete(id).subscribe({
      next: () => this.ratesArray.removeAt(index),
    });
  }

  saveRate(index: number): void {
    const group = this.ratesArray.at(index);
    if (group.invalid) {
      group.markAllAsTouched();
      return;
    }

    const taxClassId = this.record()?.id;
    if (!taxClassId) return;   // must save the TaxClass first before adding rates

    const raw = group.getRawValue();
    this.savingRates.set(true);

    const payload = {
      tax_class: taxClassId,
      name: raw.name,
      rate: raw.rate,
      region: raw.region,
      is_active: raw.is_active,
    };

    const request$ = raw.id
      ? this.taxRateService.update(raw.id, payload)
      : this.taxRateService.create(payload);

    request$.subscribe({
      next: (saved) => {
        group.patchValue({ id: saved.id });
        this.savingRates.set(false);
      },
      error: () => this.savingRates.set(false),
    });
  }

  ngOnInit(): void {}

  protected emptyValues(): TaxClassFormValues {
    return { name: '', description: '', is_active: true, rates: [] };
  }

  protected recordToValues(record: TaxClasses): TaxClassFormValues {
    return {
      name: record.name,
      description: record.description,
      is_active: record.is_active,
      rates: record.rates,
    };
  }

  override resetForm(onCancel: boolean): void {
    super.resetForm(onCancel);

    const record = this.record();
    const values = record && !onCancel ? this.recordToValues(record) : this.emptyValues();

    this.ratesArray.clear();
    values.rates.forEach((rate) => this.ratesArray.push(this.createRate(rate)));
  }
}