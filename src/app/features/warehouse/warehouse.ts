import { Component, inject } from '@angular/core';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { WarehouseFormValues, Warehouses } from './dto';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Dialog } from "primeng/dialog";
import { DataTable } from "@shared/components/data-table/data-table";
import { InputText } from "primeng/inputtext";
import { WarehouseForm } from './components/warehouse-form/warehouse-form';
import { WarehouseService } from './services/warehouse.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-warehouse',
  imports: [Button, IconField, InputIcon, Dialog, WarehouseForm, DataTable, InputText, BreadcrumbModule],
  templateUrl: './warehouse.html',
  styleUrl: './warehouse.css',
})
export class Warehouse extends BaseModalCrudPage<Warehouses, WarehouseFormValues> {
  protected readonly service = inject(WarehouseService);
  protected readonly entityLabel = 'Warehouse';

  items: MenuItem[] = [{ icon: 'pi pi-box', label: 'Warehouse' }];
  home: MenuItem = { icon: 'pi pi-home',routerLink:['/admin/dashboard'] };

  columns: TableColumn<Warehouses>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Warehouses>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

  onStatusFilterChange(status: string | null): void {
    this.updateFilters({ status });   // merges into filters signal + refetches
  }
}
