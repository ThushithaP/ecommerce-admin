import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { getFieldError } from '@shared/utills/form-errors';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastService } from '@shared/services/toast/toast.service';
import { FormMode } from '@shared/types';

import { SupplierService } from '@features/procurement/supplier/services/supplier.service';
import { Suppliers } from '@features/procurement/supplier/dto';
import { WarehouseService } from '@features/warehouse/services/warehouse.service';
import { Warehouses } from '@features/warehouse/dto';
import { ProductService } from '@features/catalog/product/services/product.service';
import { ProductVariants } from '@features/catalog/product/dto';

import { PurchaseOrderService } from '../services/purchase-order.service';
import { PurchaseOrderFormValues, PurchaseOrders } from '../dto';
import { DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

type PurchaseOrderItemGroup = FormGroup<{
  id: FormControl<number | null>;
  variant: FormControl<number | null>;
  quantityOrdered: FormControl<number>;
  unitCost: FormControl<number>;
}>;

@Component({
  selector: 'app-purchase-order-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputText, Select, DatePicker, Button, TextareaModule, DecimalPipe],
  templateUrl: './purchase-order-form.html',
  styleUrl: './purchase-order-form.css',
})
export class PurchaseOrderForm implements OnInit {
  save = output<PurchaseOrderFormValues>();
  mode = input<FormMode>('create');

  private readonly fb = inject(FormBuilder);
  private router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  private readonly supplierService = inject(SupplierService);
  private readonly warehouseService = inject(WarehouseService);
  private readonly productService = inject(ProductService);
  private readonly purchaseOrderService = inject(PurchaseOrderService);

  readonly suppliers = signal<Suppliers[]>([]);
  readonly warehouses = signal<Warehouses[]>([]);
  readonly variants = signal<ProductVariants[]>([]);

  readonly submitting = signal(false);
  readonly loading = signal(false);
  readonly poId = signal<string | null>(null);
  readonly loadedPO = signal<PurchaseOrders | null>(null);

  readonly statusOptions = [
    { value: 'draft', name: 'Draft' },
    { value: 'ordered', name: 'Ordered' },
    { value: 'cancelled', name: 'Cancelled' },
  ];

  // once a PO has received stock, items can't be added/removed (backend enforces this too)
  readonly itemsLocked = computed(() => {
    const status = this.loadedPO()?.status;
    return status === 'partially_received' || status === 'received';
  });

  readonly form = this.fb.nonNullable.group({
    supplier: [null as string | null, [Validators.required]],
    warehouse: [null as number | null, [Validators.required]],
    status: ['draft', [Validators.required]],
    orderedAt: [null as Date | null],
    expectedDate: [null as Date | null],
    notes: [''],
    items: this.fb.array<PurchaseOrderItemGroup>([]),
  });

  get f() {
    return this.form.controls;
  }

  get itemsArray(): FormArray<PurchaseOrderItemGroup> {
    return this.form.controls.items;
  }

  getError(control: any) {
    return getFieldError(control);
  }

  private createItem(item?: Partial<{ id: number; variant: number; quantityOrdered: number; unitCost: number }>): PurchaseOrderItemGroup {
    return this.fb.group({
      id: this.fb.control<number | null>(item?.id ?? null),
      variant: this.fb.control<number | null>(item?.variant ?? null, [Validators.required]),
      quantityOrdered: this.fb.nonNullable.control(item?.quantityOrdered ?? 1, [Validators.required, Validators.min(1)]),
      unitCost: this.fb.nonNullable.control(item?.unitCost ?? 0, [Validators.required, Validators.min(0)]),
    }) as PurchaseOrderItemGroup;
  }

  addItem(): void {
    if (this.itemsLocked()) return;
    this.itemsArray.push(this.createItem());
  }

  removeItem(index: number): void {
    if (this.itemsLocked()) return;
    this.itemsArray.removeAt(index);
  }

  readonly itemsValue = toSignal(
    this.itemsArray.valueChanges,
    { initialValue: this.itemsArray.getRawValue() }
  );

  readonly totalAmount = computed(() => {
    return this.itemsValue().reduce((sum, item) => {
      const qty = Number(item.quantityOrdered) || 0;
      const cost = Number(item.unitCost) || 0;

      return sum + qty * cost;
    }, 0);
  });

  ngOnInit(): void {
    this.fetchSuppliers();
    this.fetchWarehouses();
    // this.fetchVariants();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.poId.set(idParam);
      this.loadPurchaseOrder(idParam);
    } else {
      this.addItem();   // start with one empty row for create mode
    }
  }

  fetchSuppliers(): void {
    this.supplierService.list({ page: 0, pageSize: 100, search: '', ordering: 'display_name', filters: {} })
      .subscribe({ next: (res) => this.suppliers.set(res.results) });
  }

  fetchWarehouses(): void {
    this.warehouseService.list({ page: 0, pageSize: 100, search: '', ordering: 'name', filters: {} })
      .subscribe({ next: (res) => this.warehouses.set(res.results) });
  }

  // fetchVariants(): void {
  //   // this.productService.listProductVariants({ page: 0, pageSize: 1500, search: '', ordering: '', filters: {} })
  //   //   .subscribe({ next: (res) => {console.log(res.results);this.variants.set(res.results)} });
  // }

  onVariantFilter(event: any): void {
    const search = event.filter ?? '';

    this.productService.listProductVariants({
      search,
      page: 1,
      pageSize: 20, ordering: ''
    }).subscribe(response => {
      this.variants.set(response.results);
    });
  }

  loadPurchaseOrder(id: string): void {
    this.loading.set(true);
    this.purchaseOrderService.getById(id).subscribe({
      next: (po) => {
        const variantIds = po.items.map(item => item.variant);
        this.productService.getProductVarintByIds(variantIds).subscribe({
          next: (variants) => {
            this.variants.set(variants.results);
            this.populateForm(po);
            this.loading.set(false);
          },
          error: () => {
            this.toast.error('Failed to load variants.');
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.toast.error('Failed to load purchase order.');
        this.loading.set(false);
      },
    });
  }

  private populateForm(po: PurchaseOrders): void {
    this.form.patchValue({
      supplier: po.supplier,
      warehouse: po.warehouse,
      status: po.status,
      orderedAt: po.orderedAt ? new Date(po.orderedAt) : null,
      expectedDate: po.expectedDate ? new Date(po.expectedDate) : null,
      notes: po.notes,
    });

    this.itemsArray.clear();
    po.items.forEach((item) => {
      this.itemsArray.push(this.createItem({
        id: item.id,
        variant: item.variant,
        quantityOrdered: item.quantityOrdered,
        unitCost: item.unitCost,
      }));
    });
    this.loadedPO.set(po);

    if (this.itemsLocked()) {
      this.form.controls.items.disable();
    }

    this.applyDisabledStateToArrays()
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const raw = this.form.getRawValue();

    const payload: PurchaseOrderFormValues = {
      supplier: raw.supplier,
      warehouse: raw.warehouse,
      status: raw.status,
      orderedAt: raw.orderedAt ? this.formatDate(raw.orderedAt) : null,
      expectedDate: raw.expectedDate ? this.formatDate(raw.expectedDate) : null,
      notes: raw.notes,
      items: raw.items.map((i) => ({
        id: i.id ?? undefined,
        variant: i.variant,
        quantityOrdered: i.quantityOrdered,
        unitCost: i.unitCost,
      })),
    };

    this.save.emit(payload);
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  onCancel(): void {
    this.router.navigate(['admin/procurement/purchase-order']);
  }

  private applyDisabledStateToArrays(): void {
    const shouldDisable = this.mode() === 'view';
    shouldDisable ? this.form.disable() : this.form.enable();
    shouldDisable ? this.itemsArray.disable() : this.itemsArray.enable();
  }

  constructor() {
    effect(() => {
      this.applyDisabledStateToArrays();
    })
  }
}