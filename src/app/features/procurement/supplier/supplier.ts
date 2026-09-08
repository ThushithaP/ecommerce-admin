import { Component, inject } from '@angular/core';
import { SupplierFormValues, Suppliers } from './dto';
import { BaseRoutedCrudPage } from '@shared/base/pages/base-routed-crud-page.component';
import { SupplierService } from './services/supplier.service';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { DataTable } from "@shared/components/data-table/data-table";

@Component({
  selector: 'app-supplier',
  imports: [Button, IconField, InputIcon, InputText, DataTable],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css',
})
export class Supplier extends BaseRoutedCrudPage<Suppliers, SupplierFormValues> {
  protected readonly basePath = 'admin/procurement/supplier/manage';
  protected readonly service = inject(SupplierService);
  protected readonly entityLabel = 'Supplier';

  columns: TableColumn<Suppliers>[] = [
    { key: 'supplierCode', label: 'Supplier Code', sortable: true },
    { key: 'supplierType', label: 'Supplier Type', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Suppliers>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];
}
