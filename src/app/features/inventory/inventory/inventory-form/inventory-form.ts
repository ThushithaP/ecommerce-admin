import { Component, computed, inject, input, output, signal } from '@angular/core';
import { InventoryFormValues, InventoryItemGroup, Items } from '../dto';
import { FormMode } from '@shared/types';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFieldError } from '@shared/utills/form-errors';
import { Suppliers } from '@features/procurement/supplier/dto';
import { Warehouses } from '@features/warehouse/dto';
import { ProductVariants } from '@features/catalog/product/dto';
import { FormFieldComponent } from "@shared/components/form-field/form-field";
import { Select } from "primeng/select";
import { SupplierService } from '@features/procurement/supplier/services/supplier.service';
import { WarehouseService } from '@features/warehouse/services/warehouse.service';
import { ProductService } from '@features/catalog/product/services/product.service';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { DatePicker } from "primeng/datepicker";
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-form',
  imports: [ReactiveFormsModule, FormFieldComponent, Select, Button, InputText, DatePicker],
  templateUrl: './inventory-form.html',
  styleUrl: './inventory-form.css',
})
export class InventoryForm {
  save = output<InventoryFormValues>();
  mode = input<FormMode>('create');

  private router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly supplierService = inject(SupplierService);
  private readonly warehouseService = inject(WarehouseService);
  private readonly productService = inject(ProductService);

  readonly suppliers = signal<Suppliers[]>([]);
  readonly warehouses = signal<Warehouses[]>([]);
  readonly variants = signal<ProductVariants[]>([]);

  readonly submitting = signal(false);

  readonly isViewMode = computed(() => this.mode() === 'view');

  readonly form = this.fb.nonNullable.group({
    supplier: [null as string | null,],
    warehouse: [null as number | null, [Validators.required]],
    items: this.fb.array<InventoryItemGroup>([]),
  });

  get f() {
    return this.form.controls;
  }

  get itemsArray(): FormArray<InventoryItemGroup> {
    return this.form.controls.items;
  }

  getError(control: any) {
    return getFieldError(control);
  }

  onSupplierFilter(event: any): void {
    const search = event.filter ?? '';

    this.supplierService.list({
      search,
      page: 0,
      pageSize: 20, ordering: ''
    }).subscribe(response => {
      this.suppliers.set(response.results);
    });
  }

  onWarehouseFilter(event: any): void {
    const search = event.filter ?? '';

    this.warehouseService.list({
      search,
      page: 0,
      pageSize: 20, ordering: ''
    }).subscribe(response => {
      this.warehouses.set(response.results);
    });
  }

  onVariantFilter(event: any): void {
    const search = event.filter ?? '';

    this.productService.listProductVariants({
      search,
      page: 0,
      pageSize: 20, ordering: ''
    }).subscribe(response => {
      this.variants.set(response.results);
    });
  }

  private createItem(item?: Partial<{ id: number, variant: number, batchNo: string, quantity: number, costPrice: number, sellingPrice: number, manufacturedDate: Date | null, expiryDate: Date | null }>): InventoryItemGroup {
    return this.fb.group({
      id: this.fb.control<number | null>(item?.id ?? null),
      variant: this.fb.control<number | null>(item?.variant ?? null, [Validators.required]),
      batchNo: this.fb.nonNullable.control(item?.batchNo ?? ''),
      quantity: this.fb.nonNullable.control(item?.quantity ?? 1, [Validators.required, Validators.min(1)]),
      costPrice: this.fb.nonNullable.control(item?.costPrice ?? 0, [Validators.required, Validators.min(0)]),
      sellingPrice: this.fb.nonNullable.control(item?.sellingPrice ?? 0, [Validators.required, Validators.min(0)]),
      manufacturedDate: this.fb.nonNullable.control<Date | null>(item?.manufacturedDate ? new Date(item.manufacturedDate) : null),
      expiryDate: this.fb.nonNullable.control<Date | null>(item?.expiryDate ? new Date(item.expiryDate) : null),
    }) as InventoryItemGroup;
  }

  addItem(): void {
    // if (this.itemsLocked()) return;
    this.itemsArray.push(this.createItem());
  }

  removeItem(index: number): void {
    // if (this.itemsLocked()) return;
    this.itemsArray.removeAt(index);
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  onSubmit(): void {
    const raw = this.form.getRawValue();
    const payload: InventoryFormValues = {
      supplier: raw.supplier,
      warehouse: raw.warehouse,
      items: raw.items.map((i): Items => ({
        id: i.id,
        variant: i.variant,
        quantity: i.quantity,
        batchNo: i.batchNo,
        costPrice: i.costPrice,
        sellingPrice: i.sellingPrice,
        manufacturedDate: i.manufacturedDate ? this.formatDate(i.manufacturedDate) : null,
        expiryDate: i.expiryDate ? this.formatDate(i.expiryDate) : null,
      })),
    };
    this.save.emit(payload)
  }

  onCancel(): void {
    this.router.navigate(['/admin/inventory/inventory']);
  }

}
