import { Component, inject, OnInit, signal } from '@angular/core';
import {Router} from '@angular/router';
import { Button } from "primeng/button";
import { Drawer } from 'primeng/drawer';
import { RoleForm } from "./components/role-form/role-form";
import { RoleService } from './service/role.service';
import { Role, RoleFormValues } from './dto';
import { DataTable } from "@shared/components/data-table/data-table";
import { PageEvent, SortEvent, TableAction, TableColumn } from '@shared/models/table-column.model';
import { InputText } from "primeng/inputtext";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Tooltip } from "primeng/tooltip";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { FormMode } from '@shared/types';
import { ToastService } from '@shared/services/toast/toast.service';

@Component({
  selector: 'app-roles',
  imports: [Button, Drawer, RoleForm, DataTable, InputText, Tooltip, IconField, InputIcon],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {
  private readonly roleService = inject(RoleService);
  private readonly toast = inject(ToastService);
  private router = inject(Router);

  visibleRight: boolean = false;

  readonly formMode = signal<FormMode>('create');
  readonly selectedRole = signal<Role | null>(null);

  readonly roles = signal<Role[]>([]);
  readonly loading = signal(false);

  readonly totalCount = signal(0);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly sortColumn = signal('');
  readonly sortDirection = signal<'asc' | 'desc' | ''>('');
  readonly search = signal('');

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  columns: TableColumn<Role>[] = [
    { key: 'name', label: 'Role Name', sortable: true },
    { key: 'is_active', label: 'Status', type: 'boolean', },
    { key: 'created_at', label: 'Created', type: 'date', formatter: (v) => new Date(v).toLocaleDateString() },
  ];

  actions: TableAction<Role>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.viewRole(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.editRole(row) },
    { label: '', tooltip: 'Permission', color: 'default', icon: 'pi pi-asterisk', handler: (row) => this.navigateToRolePermission(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.deleteRole(row) },
  ];

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.search.set(value);
        this.pageIndex.set(0);
        this.fetchRoles();
      });
    this.fetchRoles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchRoles(): void {
    this.loading.set(true);
    const ordering =
      this.sortDirection() && this.sortColumn()
        ? `${this.sortDirection() === 'desc' ? '-' : ''}${this.sortColumn()}`
        : '';

    this.roleService.list({
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      search: this.search(),
      ordering,
    }).subscribe({
      next: (res) => {
        this.roles.set(res.results);
        this.totalCount.set(res.count);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.selectedRole.set(null);
    this.formMode.set('create');
    this.visibleRight = true;
  }

  saveRole(values: RoleFormValues): void {
    const role = this.selectedRole();

    if (role) {
      // EDIT
      this.roleService.update(role.id, values).subscribe({
        next: () => {
          this.visibleRight = false;
          this.selectedRole.set(null);
          this.fetchRoles();
          this.toast.success('Updated Success')
        },
      });
      return;
    }

    // CREATE
    this.roleService.create(values).subscribe({
      next: () => {
        this.visibleRight = false;
        this.fetchRoles();
        this.toast.success('Created Success')
      },
      error: () => {
        this.toast.error('Failed to create role.');
      },
    });
  }

  onPageChange(e: PageEvent): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.fetchRoles();
  }

  onSortChange(e: SortEvent): void {
    this.sortColumn.set(e.column);
    this.sortDirection.set(e.direction);
    this.pageIndex.set(0);
    this.fetchRoles();
  }

  editRole(row: Role): void {
    this.selectedRole.set(row);
    this.formMode.set('edit');
    this.visibleRight = true;
  }

  viewRole(row: Role): void {
    this.selectedRole.set(row);
    this.formMode.set('view');
    this.visibleRight = true;
  }

  deleteRole(row: Role): void {
    this.roleService.delete(row.id).subscribe(() => this.fetchRoles());
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  clearFilters(): void {
    this.search.set('');
    this.sortColumn.set('');
    this.sortDirection.set('');
    this.pageIndex.set(0);

    this.fetchRoles();
  }

  navigateToRolePermission(row:Role):void {
    this.router.navigate(
      ['admin/rbac/roles-permissions', row.id],
      {
        queryParams :{
          name:row.name
        }
      }
    );
  }
}
