import { Component,inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { formatDateTime } from '@shared/utills';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { DataTable } from "@shared/components/data-table/data-table";
import { AttributeGroupService } from './services/attribute-group.service';
import { AttributeGroups, AttributeGroupFormValues } from './dto';
import { AttributeGroupForm } from "./components/attribute-group-form/attribute-group-form";
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';

@Component({
  selector: 'app-attribute-group',
  imports: [BreadcrumbModule, ButtonModule, DialogModule, InputTextModule, IconField, InputIcon, DataTable, AttributeGroupForm],
  templateUrl: './attribute-group.html',
  styleUrl: './attribute-group.css',
})
export class AttributeGroup extends BaseModalCrudPage<AttributeGroups,AttributeGroupFormValues> {
  protected readonly service = inject(AttributeGroupService);
  protected readonly entityLabel = 'Attribute Group';
  
  items: MenuItem[] = [{ icon: 'pi pi-list', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<AttributeGroups>[] = [
    { key: 'name', label: 'Attribute Group Name', sortable: true },
    { key: 'sortOrder', label: 'Sort Order', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<AttributeGroups>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

  onStatusFilterChange(status: string | null): void {
    this.updateFilters({ status });   // merges into filters signal + refetches
  }
}
