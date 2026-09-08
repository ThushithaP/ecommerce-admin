import { Component, inject } from '@angular/core';
import { BaseRoutedCrudPage } from '@shared/base/pages/base-routed-crud-page.component';
import { Inventories, InventoryFormValues } from './dto';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { InventoryService } from './services/inventory.service';
import { formatDateTime } from '@shared/utills';
import { DataTable } from "@shared/components/data-table/data-table";
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'app-inventory',
  imports: [DataTable, Button, IconField, InputIcon, InputText],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory extends BaseRoutedCrudPage<Inventories, InventoryFormValues> {
  protected readonly basePath = 'admin/inventory/inventory/manage';
  protected readonly service = inject(InventoryService)
  protected readonly entityLabel = 'Inventory';

  columns: TableColumn<Inventories>[] = [
    { key: 'productName', label: 'Product', sortable: true },
    { key: 'sku', label: 'SKU', sortable: false },
    { key: 'varientLabel', label: 'Varient', sortable: false },
    { key: 'warehouseName', label: 'Warehouse', sortable: false },
    { key: 'availableQuantity', label: 'Available Qty.', sortable: false },
    { key: 'batchNo', label: 'Batch No', sortable: false },
    { key: 'costPrice', label: 'Cost', sortable: false },
    { key: 'sellingPrice', label: 'Selling Price', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Inventories>[] = [
    // { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    // { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    // { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

}
