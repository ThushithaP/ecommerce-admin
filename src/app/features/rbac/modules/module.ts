import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ModuleForm } from "./components/module-form/module-form";
import { ModuleService } from './service/module.service';
import { Modules, ModuleFormValues } from './dto';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { DataTable } from "@shared/components/data-table/data-table";
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-modules',
  imports: [BreadcrumbModule, ButtonModule, DialogModule, InputTextModule, ModuleForm, IconField, InputIcon, DataTable],
  templateUrl: './module.html',
  styleUrl: './module.css',
})
export class Module extends BaseModalCrudPage<Modules,ModuleFormValues> {
  protected readonly service = inject(ModuleService);
  protected readonly entityLabel = 'Module';

  items: MenuItem[] = [{ icon: 'pi pi-th-large', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<Modules>[] = [
    { key: 'name', label: 'Module Name', sortable: true },
    { key: 'code', label: 'Module Code', sortable: true },
    // { key: 'is_active', label: 'Status', type: 'boolean', },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: (v) => new Date(v).toLocaleDateString() },
  ];

  actions: TableAction<Modules>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];
}
