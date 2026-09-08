import { Component, inject } from '@angular/core';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { Branches, BranchFormValues } from './dto';
import { BranchService } from './service/branch.service';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Dialog } from "primeng/dialog";
import { BranchForm } from "./components/branch-form/branch-form";
import { DataTable } from "@shared/components/data-table/data-table";
import { InputText } from "primeng/inputtext";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-branch',
  imports: [Button, IconField, InputIcon, Dialog, BranchForm, DataTable, InputText, BreadcrumbModule],
  templateUrl: './branch.html',
  styleUrl: './branch.css',
})
export class Branch extends BaseModalCrudPage<Branches, BranchFormValues> {
  protected readonly service = inject(BranchService);
  protected readonly entityLabel = 'Branch';

  items: MenuItem[] = [{ icon: 'pi pi-building', label: 'Branch' }];
  home: MenuItem = { icon: 'pi pi-home',routerLink:['/admin/dashboard'] };

  columns: TableColumn<Branches>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Branches>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

  onStatusFilterChange(status: string | null): void {
    this.updateFilters({ status });   // merges into filters signal + refetches
  }
}
