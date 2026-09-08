import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { getFieldError } from '@shared/utills/form-errors';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { SelectOption } from '@shared/interfaces';

import { InventoryService } from '@features/inventory/inventory/services/inventory.service';
import { Inventories } from '@features/inventory/inventory/dto';
import { StockAdjustments, StockAdjustmentFormValue } from '../dto';

@Component({
  selector: 'app-stock-adjustment-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputText, Select, TextareaModule, Button],
  templateUrl: './stock-adjustment-form.html',
  styleUrl: './stock-adjustment-form.css',
})
export class StockAdjustmentForm extends BaseModalFormComponent<StockAdjustments, StockAdjustmentFormValue> implements OnInit {
  private readonly inventoryService = inject(InventoryService);
  readonly inventoryBatches = signal<Inventories[]>([]);

  readonly reasonOptions: SelectOption[] = [
    { value: 'damage', name: 'Damaged' },
    { value: 'lost', name: 'Lost' },
    { value: 'found', name: 'Found / Stock Count Correction' },
    { value: 'expired', name: 'Expired' },
    { value: 'other', name: 'Other' },
  ];

  readonly form = this.fb.nonNullable.group({
    inventory: [null as number | null, [Validators.required]],
    quantityDelta: [0, [Validators.required]],
    reason: ['', [Validators.required]],
    notes: [''],
  });

  override get f() {
    return this.form.controls;
  }

  // getError(control: any) {
  //   return getFieldError(control);
  // }

  ngOnInit(): void {
    this.inventoryService.list({ page: 0, pageSize: 200, search: '', ordering: 'sku', filters: {} })
      .subscribe({ next: (res) => this.inventoryBatches.set(res.results) });
  }

  protected emptyValues(): StockAdjustmentFormValue {
    return { inventory: null as any, quantityDelta: 0, reason: '', notes: '' };
  }

  protected recordToValues(record: StockAdjustments): StockAdjustmentFormValue {
    return {
      inventory: record.inventory,
      quantityDelta: record.quantityDelta,
      reason: record.reason,
      notes: record.notes,
    };
  }
}