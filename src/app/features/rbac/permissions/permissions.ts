import { Component, computed, inject, signal } from '@angular/core';
import { PermissionForm } from "./components/permission-form/permission-form";
import { Dialog } from "primeng/dialog";
import { formatDateTime, getFormTitle, reloadPage } from '@shared/utills';
import { FormMode } from '@shared/types';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { CreatePermissionDto, Permission, UpdatePermissionDto } from './dto';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { PageEvent, SortEvent, TableAction, TableColumn } from '@shared/models/table-column.model';
import { PermissionService } from './services/permission.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { DataTable } from "@shared/components/data-table/data-table";
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'app-permissions',
  imports: [PermissionForm, Dialog, Button, IconField, InputIcon, DataTable, InputText],
  templateUrl: './permissions.html',
  styleUrl: './permissions.css',
})
export class Permissions {
  private readonly permissionService = inject(PermissionService);
  private readonly toast = inject(ToastService);

  visible: boolean = false;
  readonly dialogHeader = computed(() =>
    getFormTitle(this.formMode(), 'Permissions')
  );

  readonly formMode = signal<FormMode>('create');
  readonly selectedRecord = signal<Permission | null>(null);

  readonly records = signal<Permission[]>([]);
  readonly loading = signal(false);

  readonly totalCount = signal(0);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly sortColumn = signal('');
  readonly sortDirection = signal<'asc' | 'desc' | ''>('');
  readonly search = signal('');

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  columns: TableColumn<Permission>[] = [
    { key: 'module_name', label: 'Module Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'action', label: 'Action', },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Permission>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

  fetchRecords(): void {
    this.loading.set(true);
    const ordering =
      this.sortDirection() && this.sortColumn()
        ? `${this.sortDirection() === 'desc' ? '-' : ''}${this.sortColumn()}`
        : '';

    this.permissionService.list({
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      search: this.search(),
      ordering,
    }).subscribe({
      next: (res) => {
        this.records.set(res.results);
        this.totalCount.set(res.count);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to retrieve.');
      },
    });
  }

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
        this.fetchRecords();
      });
    this.fetchRecords();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open(): void {
    this.selectedRecord.set(null);
    this.formMode.set('create');
    this.visible = true;
  }

  edit(row: Permission): void {
    this.selectedRecord.set(row);
    this.formMode.set('edit');
    this.visible = true;
  }

  view(row: Permission): void {
    this.selectedRecord.set(row);
    this.formMode.set('view');
    this.visible = true;
  }

  delete(row: Permission): void {
    this.permissionService.delete(row.id).subscribe(() => this.fetchRecords())
  }

  save(values: CreatePermissionDto | UpdatePermissionDto): void {
    const reccord = this.selectedRecord();

    // EDIT
    if (this.formMode() === 'edit' && reccord) {
      const payload = values as UpdatePermissionDto;
      this.permissionService.update(reccord.id, payload).subscribe({
        next: () => {
          this.visible = false;
          this.selectedRecord.set(null);
          this.fetchRecords();
          this.toast.success('Updated Success');
        },
        error: () => {
          this.toast.error('Failed to update');
          reloadPage();
        },
      });
      return;
    }

    // CREATE
    if (this.formMode() === 'create') {
      const payload = values as CreatePermissionDto;
      this.permissionService.create(payload).subscribe({
        next: () => {
          this.visible = false;
          this.fetchRecords();
          this.toast.success('Create Success');
        },
        error: () => {
          this.toast.error('Failed to create');
          reloadPage();
        },
      });
    }
  }

  onPageChange(e: PageEvent): void {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.fetchRecords();
  }

  onSortChange(e: SortEvent): void {
    this.sortColumn.set(e.column);
    this.sortDirection.set(e.direction);
    this.pageIndex.set(0);
    this.fetchRecords();
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  clearFilters(): void {
    this.search.set('');
    this.sortColumn.set('');
    this.sortDirection.set('');
    this.pageIndex.set(0);

    this.fetchRecords();
  }

}
