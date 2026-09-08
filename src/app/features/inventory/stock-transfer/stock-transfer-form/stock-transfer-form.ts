import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { getFieldError } from '@shared/utills/form-errors';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Button } from 'primeng/button';

import { WarehouseService } from '@features/warehouse/services/warehouse.service';
import { Warehouses } from '@features/warehouse/dto';
import { ProductService } from '@features/catalog/product/services/product.service';
import { ProductVariants } from '@features/catalog/product/dto';

import { StockTransfers, StockTransferFormValues, StockTransferItemInput } from '../dto';

type TransferItemGroup = FormGroup<{
  variant: FormControl<number | null>;
  quantity: FormControl<number>;
  batchNo: FormControl<string>;
}>;

@Component({
  selector: 'app-stock-transfer-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputText, Select, TextareaModule, Button],
  templateUrl: './stock-transfer-form.html',
  styleUrl: './stock-transfer-form.css',
})
export class StockTransferForm extends BaseModalFormComponent<StockTransfers, StockTransferFormValues> implements OnInit {
  private readonly warehouseService = inject(WarehouseService);
  private readonly variantService = inject(ProductService);

  readonly warehouses = signal<Warehouses[]>([]);
  readonly variants = signal<ProductVariants[]>([]);

  readonly form = this.fb.nonNullable.group({
    from_warehouse: [null as number | null, [Validators.required]],
    to_warehouse: [null as number | null, [Validators.required]],
    notes: [''],
    items: this.fb.array<TransferItemGroup>([]),
  });

  override get f() {
    return this.form.controls;
  }

  get itemsArray(): FormArray<TransferItemGroup> {
    return this.form.controls.items;
  }

  // getError(control: any) {
  //   return getFieldError(control);
  // }

  private createItem(item?: Partial<StockTransferItemInput>): TransferItemGroup {
    return this.fb.group({
      variant: this.fb.control<number | null>(item?.variant ?? null, [Validators.required]),
      quantity: this.fb.nonNullable.control(item?.quantity ?? 1, [Validators.required, Validators.min(1)]),
      batchNo: this.fb.nonNullable.control(item?.batchNo ?? ''),
    }) as TransferItemGroup;
  }

  addItem(): void {
    this.itemsArray.push(this.createItem());
  }

  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }

  ngOnInit(): void {
    this.warehouseService.list({ page: 0, pageSize: 100, search: '', ordering: 'name', filters: {} })
      .subscribe({ next: (res) => this.warehouses.set(res.results) });

    this.variantService.listProductVariants({ page: 0, pageSize: 200, search: '', ordering: 'sku', filters: {} })
      .subscribe({ next: (res) => this.variants.set(res.results) });

    if (this.mode() === 'create' && this.itemsArray.length === 0) {
      this.addItem();
    }
  }

  protected emptyValues(): StockTransferFormValues {
    return { from_warehouse: null, to_warehouse: null, notes: '', items: [] };
  }

  protected recordToValues(record: StockTransfers): StockTransferFormValues {
    return {
      from_warehouse: record.from_warehouse,
      to_warehouse: record.to_warehouse,
      notes: record.notes,
      items: record.items.map((i) => ({ variant: i.variant, quantity: i.quantity, batchNo: i.batchNo })),
    };
  }

  override resetForm(onCancel: boolean): void {
    super.resetForm(onCancel);

    const record = this.record();
    const values = record && !onCancel ? this.recordToValues(record) : this.emptyValues();

    this.itemsArray.clear();
    values.items.forEach((item) => this.itemsArray.push(this.createItem(item)));
  }
}