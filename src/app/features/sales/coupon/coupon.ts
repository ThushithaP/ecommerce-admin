import { Component, inject } from '@angular/core';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { Coupons, CouponPayload } from './dto';
import { CouponService } from './services/coupon.service';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { Dialog } from "primeng/dialog";
import { CouponForm } from "./coupon-form/coupon-form";
import { DataTable } from "@shared/components/data-table/data-table";

@Component({
  selector: 'app-coupon',
  imports: [Button, IconField, InputIcon, InputText, Dialog, CouponForm, DataTable],
  templateUrl: './coupon.html',
  styleUrl: './coupon.css',
})
export class Coupon extends BaseModalCrudPage<Coupons, CouponPayload> {
  protected readonly service = inject(CouponService);
  protected readonly entityLabel = 'Coupon';

  columns: TableColumn<Coupons>[] = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'usageCount', label: 'Used', sortable: false },
    { key: 'usageLimit', label: 'Limit', formatter: (v) => v ?? 'Unlimited' },
    { key: 'end_date', label: 'Expires', type: 'date', formatter: formatDateTime },
    { key: 'is_active', label: 'Status', type: 'boolean', align: 'center' },
  ];

  actions: TableAction<Coupons>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];
}