import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { getFieldError } from '@shared/utills/form-errors';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastService } from '@shared/services/toast/toast.service';

import { PurchaseOrderService } from '@features/procurement/purchase-order/services/purchase-order.service';
import { PurchaseOrders } from '@features/procurement/purchase-order/dto';
import { StaffService } from '@features/staff/services/staff.service';
import { Staffs } from '@features/staff/dto';

import { GoodsReceiptService } from '../services/goods-receipt.service';
import { GoodsReceiptFormValues, GoodsReceiptItemInput, GoodsReceipts } from '../dto';
import { FormMode } from '@shared/types';
import { Router } from '@angular/router';

type ReceiptItemGroup = FormGroup<{
  purchaseOrderItem: FormControl<number>;
  sku: FormControl<string>;
  productName: FormControl<string>;
  quantityOrdered: FormControl<number>;
  quantityAlreadyReceived: FormControl<number>;
  quantityReceived: FormControl<number>;
  quantityAccepted: FormControl<number>;
  batchNo: FormControl<string>;
  manufacturedDate: FormControl<Date | null>;
  expiryDate: FormControl<Date | null>;
}>;

@Component({
  selector: 'app-goods-receipt-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputText, Select, DatePicker, Button, TextareaModule],
  templateUrl: './goods-receipt-form.html',
  styleUrl: './goods-receipt-form.css',
})
export class GoodsReceiptForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  private readonly purchaseOrderService = inject(PurchaseOrderService);
  private readonly staffService = inject(StaffService);
  private readonly goodsReceiptService = inject(GoodsReceiptService);

  readonly purchaseOrders = signal<PurchaseOrders[]>([]);
  readonly staff = signal<Staffs[]>([]);
  readonly loadedPO = signal<PurchaseOrders | null>(null);
  readonly submitting = signal(false);
  readonly loadingPO = signal(false);
  readonly loading = signal(false);
  readonly receiptNo = signal<string | null>(null);

  mode = input<FormMode>('create');
  id = input<string | null>(null);

  private router = inject(Router);

  readonly hasReceivableItems = computed(() =>
    this.itemsArray.controls.length > 0
  );
  readonly isViewMode = computed(() => this.mode() === 'view');

  readonly form = this.fb.nonNullable.group({
    purchaseOrder: [null as string | null, [Validators.required]],
    receivedBy: [null as string | null],
    receivedAt: [new Date(), [Validators.required]],
    notes: [''],
    items: this.fb.array<ReceiptItemGroup>([]),
  });

  get f() {
    return this.form.controls;
  }

  get itemsArray(): FormArray<ReceiptItemGroup> {
    return this.form.controls.items;
  }

  getError(control: any) {
    return getFieldError(control);
  }

  ngOnInit(): void {
    this.fetchOpenPurchaseOrders();
    this.fetchStaff();

    const id = this.id();
    if (id !== null) {
      this.loadReceipt(id);
    }
  }

  fetchOpenPurchaseOrders(): void {
    // only POs that still have something left to receive
    this.purchaseOrderService.list({
      page: 0, pageSize: 100, search: '', ordering: '-created_at',
      filters: { status__in: 'ordered,partially_received' },
    }).subscribe({ next: (res) => this.purchaseOrders.set(res.results) });
  }

  fetchStaff(): void {
    this.staffService.list({ page: 0, pageSize: 100, search: '', ordering: 'name', })
      .subscribe({ next: (res) => this.staff.set(res.results) });
  }

  loadReceipt(id: string): void {
    this.loading.set(true);
    this.goodsReceiptService.getById(id).subscribe({
      next: (receipt) => {
        this.populateForm(receipt);
        this.receiptNo.set(receipt.receiptNo);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load goods receipt.');
        this.loading.set(false);
      },
    });
  }

  private populateForm(receipt: GoodsReceipts): void {
    // populate the PO dropdown with just this one entry so the select displays correctly, even though it's disabled
    this.purchaseOrders.set([{ id: receipt.purchaseOrder, poNumber: receipt.poNumber } as PurchaseOrders]);
    
    this.form.patchValue({
      purchaseOrder: receipt.purchaseOrder,
      receivedBy: receipt.receivedBy,
      receivedAt: new Date(receipt.receivedAt),
      notes: receipt.notes,
    });

    this.itemsArray.clear();
    receipt.items.forEach((item) => {
      this.itemsArray.push(
        this.fb.group({
          purchaseOrderItem: this.fb.nonNullable.control(item.purchaseOrderItem),
          sku: this.fb.nonNullable.control(item.sku),
          productName: this.fb.nonNullable.control(item.productName),
          quantityOrdered: this.fb.nonNullable.control(0),   // not returned by GET — display-only, not needed in view mode
          quantityAlreadyReceived: this.fb.nonNullable.control(0),
          quantityReceived: this.fb.nonNullable.control(item.quantityReceived),
          quantityAccepted: this.fb.nonNullable.control(item.quantityAccepted),
          batchNo: this.fb.nonNullable.control(item.batchNo),
          manufacturedDate: this.fb.control<Date | null>(item.manufacturedDate ? new Date(item.manufacturedDate) : null),
          expiryDate: this.fb.control<Date | null>(item.expiryDate ? new Date(item.expiryDate) : null),
        }) as ReceiptItemGroup
      );
    });

    this.form.disable();   // fully lock the form — view mode only, receipts are never editable
  }

  onPurchaseOrderSelected(poId: string): void {
    this.loadingPO.set(true);
    this.purchaseOrderService.getById(poId).subscribe({
      next: (po) => {
        this.loadedPO.set(po);
        this.buildItemsFromPO(po);
        this.loadingPO.set(false);
      },
      error: () => {
        this.toast.error('Failed to load purchase order details.');
        this.loadingPO.set(false);
      },
    });
  }

  private buildItemsFromPO(po: PurchaseOrders): void {
    this.itemsArray.clear();

    po.items
      .filter((item) => item.quantityReceived < item.quantityOrdered)   // only rows with something left to receive
      .forEach((item) => {
        const remaining = item.quantityOrdered - item.quantityReceived;
        this.itemsArray.push(
          this.fb.group({
            purchaseOrderItem: this.fb.nonNullable.control(item.id),
            sku: this.fb.nonNullable.control(item.sku),
            productName: this.fb.nonNullable.control(item.productName),
            quantityOrdered: this.fb.nonNullable.control(item.quantityOrdered),
            quantityAlreadyReceived: this.fb.nonNullable.control(item.quantityReceived),
            quantityReceived: this.fb.nonNullable.control(remaining, [Validators.required, Validators.min(1), Validators.max(remaining)]),
            quantityAccepted: this.fb.nonNullable.control(remaining, [Validators.required, Validators.min(0)]),
            batchNo: this.fb.nonNullable.control(''),
            manufacturedDate: this.fb.control<Date | null>(null),
            expiryDate: this.fb.control<Date | null>(null),
          }) as ReceiptItemGroup
        );
      });
  }

  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid || this.itemsArray.length === 0) {
      this.form.markAllAsTouched();
      if (this.itemsArray.length === 0) {
        this.toast.error('At least one line item is required.');
      }
      return;
    }

    this.submitting.set(true);
    const raw = this.form.getRawValue();

    const payload: GoodsReceiptFormValues = {
      purchaseOrder: raw.purchaseOrder,
      receivedBy: raw.receivedBy,
      receivedAt: raw.receivedAt ? raw.receivedAt.toISOString() : null,
      notes: raw.notes,
      items: raw.items.map((i): GoodsReceiptItemInput => ({
        purchaseOrderItem: i.purchaseOrderItem,
        quantityReceived: i.quantityReceived,
        quantityAccepted: i.quantityAccepted,
        batchNo: i.batchNo,
        manufacturedDate: i.manufacturedDate ? this.formatDate(i.manufacturedDate) : null,
        expiryDate: i.expiryDate ? this.formatDate(i.expiryDate) : null,
      })),
    };

    this.goodsReceiptService.create(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.success('Goods receipt recorded.');
      },
      error: () => {
        this.submitting.set(false);
        this.toast.error('Failed to record goods receipt.');
      },
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  onCancel(): void {
    this.router.navigate(['/admin/procurement/goods-receipt']);
  }
}