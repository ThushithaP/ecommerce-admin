import { Component, inject, signal } from '@angular/core';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Dialog } from "primeng/dialog";
import { DataTable } from "@shared/components/data-table/data-table";
import { InputText } from "primeng/inputtext";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { OrderFormValues, OrderPayment, Orders } from './dto';
import { OrderService } from './services/order.service';
import { BaseRoutedCrudPage } from '@shared/base/pages/base-routed-crud-page.component';
import { takeUntil } from 'rxjs';
import { PaymentForm } from "./payment-form/payment-form";
import { OptionStatus } from '@features/staff/dto';
import { Select } from "primeng/select";

@Component({
  selector: 'app-order',
  imports: [DataTable, Dialog, PaymentForm, BreadcrumbModule, Button, IconField, InputIcon, InputText, Select],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order extends BaseRoutedCrudPage<Orders, OrderFormValues> {
  protected readonly basePath = 'admin/sales/order';
  protected readonly service = inject(OrderService);
  protected readonly entityLabel = 'Order';

  items: MenuItem[] = [{ icon: 'pi pi-box', label: 'Warehouse' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  visiblePayment = false;
  readonly selectedPayments = signal<OrderPayment[] | null>(null);

  columns: TableColumn<Orders>[] = [
    { key: 'orderNo', label: 'Order No', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'customerPhone', label: 'Phone', sortable: false },
    { key: 'customerEmail', label: 'Email', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'ordered_at', label: 'Order At', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Orders>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Payments', color: 'default', icon: 'pi pi-dollar', handler: (row) => this.viewPayment(row.id) },
  ];

  readonly status: OptionStatus[] = [
    { value: 'pending', name: 'Pending' },
    { value: 'confirmed', name: 'Confirmed' },
    { value: 'shipped', name: 'Shipped' },
    { value: 'delivered', name: 'Delivered' },
    { value: 'cancelled', name: 'Cancelled' },
  ];

  onStatusFilterChange(status: string | null): void {
    this.updateFilters({ status });   // merges into filters signal + refetches
  }

  viewPayment(id: string) {
    this.service.getPaymentByOrderId(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.selectedPayments.set(res);
        this.visiblePayment = true;
      },
      error: () => this.toast.error(`Failed to load payments.`),
    })
  }
}
