import { Component, inject } from '@angular/core';
import { BaseRoutedCrudPage } from '@shared/base/pages/base-routed-crud-page.component';
import { PurchaseOrderFormValues, PurchaseOrders } from './dto';
import { PurchaseOrderService } from './services/purchase-order.service';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { DataTable } from "@shared/components/data-table/data-table";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-purchase-order',
  imports: [BreadcrumbModule, Button, IconField, InputIcon, InputText, DataTable],
  templateUrl: './purchase-order.html',
  styleUrl: './purchase-order.css',
})
export class PurchaseOrder extends BaseRoutedCrudPage<PurchaseOrders, PurchaseOrderFormValues> {
  protected readonly basePath = 'admin/procurement/purchase-order/manage';
  protected readonly service = inject(PurchaseOrderService);
  protected readonly entityLabel = 'Purchase Order';

  items: MenuItem[] = [{ icon: 'pi pi-file-edit', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<PurchaseOrders>[] = [
    { key: 'poNumber', label: 'PO Number', sortable: true },
    { key: 'supplierName', label: 'Supplier Name', sortable: false },
    { key: 'warehouseName', label: 'Warehouse', sortable: false },
    { key: 'totalAmount', label: 'Total Amount', sortable: false },
    { key: 'orderedAt', label: 'Ordered At', sortable: false },
    { key: 'expectedDate', label: 'Expected At', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<PurchaseOrders>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];
}
