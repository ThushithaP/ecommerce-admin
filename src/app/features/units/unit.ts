import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { formatDateTime } from '@shared/utills';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { DataTable } from '@shared/components/data-table/data-table';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { UnitFormValues, Units } from './dto';
import { UnitService } from './services/unit.service';
import { UnitForm } from './components/unit-form/unit-form';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';

@Component({
  selector: 'app-units',
  imports: [BreadcrumbModule, ButtonModule, DialogModule, InputTextModule, SelectModule, IconField, InputIcon, DataTable, UnitForm],
  templateUrl: './unit.html',
  styleUrl: './unit.css',
})
export class Unit extends BaseModalCrudPage<Units, UnitFormValues> {
  protected readonly service = inject(UnitService);
  protected readonly entityLabel = 'Unit';

  items: MenuItem[] = [{ icon: 'pi pi-calculator', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<Units>[] = [
    { key: 'name', label: 'Unit Name', sortable: true },
    { key: 'symbol', label: 'Symbol', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Units>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

  // This feature's own filter options — nothing to do with the base class
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Called from the template when the dropdown changes
  onStatusFilterChange(status: string | null): void {
    this.updateFilters({ status });   // merges into filters signal + refetches
  }
}
