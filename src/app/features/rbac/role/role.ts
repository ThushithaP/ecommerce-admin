import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from "primeng/button";
import { RoleForm } from "./components/role-form/role-form";
import { RoleService } from './service/role.service';
import { Roles, RoleFormValues } from './dto';
import { DataTable } from "@shared/components/data-table/data-table";
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { InputText } from "primeng/inputtext";
import { Tooltip } from "primeng/tooltip";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-roles',
  imports: [BreadcrumbModule, Button, RoleForm, DataTable, InputText, Tooltip, IconField, InputIcon, DialogModule],
  templateUrl: './role.html',
  styleUrl: './role.css',
})
export class Role extends BaseModalCrudPage<Roles, RoleFormValues> {
  protected readonly service = inject(RoleService);
  protected readonly entityLabel = 'Role';

  private router = inject(Router);

  items: MenuItem[] = [{ icon: 'pi pi-shield', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<Roles>[] = [
    { key: 'name', label: 'Role Name', sortable: true },
    { key: 'is_active', label: 'Status', type: 'boolean', },
    { key: 'created_at', label: 'Created', type: 'date', formatter: (v) => new Date(v).toLocaleDateString() },
  ];

  actions: TableAction<Roles>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Permission', color: 'default', icon: 'pi pi-asterisk', handler: (row) => this.navigateToRolePermission(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];


  navigateToRolePermission(row: Roles): void {
    this.router.navigate(
      ['admin/rbac/roles-permissions', row.id],
      {
        queryParams: {
          name: row.name
        }
      }
    );
  }
}
