import { Component, computed, inject, signal } from '@angular/core';
import { StaffForm } from "./components/staff-form/staff-form";
import { StaffService } from './services/staff.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { formatDateTime, getFormTitle } from '@shared/utills';
import { FormMode } from '@shared/types';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { Dialog } from "primeng/dialog";
import { CreateStaffDto, Staffs } from './dto';
import { PageEvent, SortEvent, TableAction, TableColumn } from '@shared/models/table-column.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DataTable } from "@shared/components/data-table/data-table";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { HasPermissionDirective } from "@shared/directives/has-permission.derective";
import { PermissionService } from '@core/services/permission.service';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-staff',
  imports: [StaffForm, Button, IconField, Dialog, DataTable, InputIcon, InputText, HasPermissionDirective, BreadcrumbModule],
  templateUrl: './staff.html',
  styleUrl: './staff.css',
})
export class Staff {
  private readonly staffService = inject(StaffService);
  private readonly permissionService = inject(PermissionService);
  private readonly toast = inject(ToastService);

  items: MenuItem[] = [{ icon: 'pi pi-users', label: 'Staff' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  visible: boolean = false;
  readonly dialogHeader = computed(() =>
    getFormTitle(this.formMode(), 'Staff')
  );

  readonly formMode = signal<FormMode>('create');
  readonly selectedRecord = signal<any>(null);

  readonly records = signal<any[]>([]);
  readonly loading = signal(false);

  readonly totalCount = signal(0);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly sortColumn = signal('');
  readonly sortDirection = signal<'asc' | 'desc' | ''>('');
  readonly search = signal('');

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();


  columns: TableColumn<Staffs>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'emp_no', label: 'Emp No', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'is_active', label: 'Status', type: 'boolean', },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Staffs>[] = [
    {
      label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', visible: () => this.permissionService.has('staff.update'),
      handler: (row) => this.view(row)
    },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
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
        this.fetchRecords();
      });
    this.fetchRecords();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchRecords(): void {
    this.loading.set(true);
    const ordering =
      this.sortDirection() && this.sortColumn()
        ? `${this.sortDirection() === 'desc' ? '-' : ''}${this.sortColumn()}`
        : '';

    this.staffService.list({
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

  open(): void {
    this.fetchRecords();
    this.selectedRecord.set(null);
    this.formMode.set('create');
    this.visible = true;
  }

  save(values: CreateStaffDto): void {
    const record = this.selectedRecord();
    if (record) {
      // EDIT
      this.staffService.update(record.id, values).subscribe({
        next: () => {
          this.visible = false;
          this.selectedRecord.set(null);
          this.fetchRecords();
          this.toast.success('Updated Success');
        },
        error: () => {
          this.toast.error('Failed to create role.');
        },
      });
      return;
    }

    // CREATE
    this.staffService.create(values).subscribe({
      next: () => {
        this.visible = false;
        this.fetchRecords();
        this.toast.success('Created Successfully')
      },
      error: () => {
        this.toast.error('Failed to create role.');
      },
    });
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

  edit(row: Staffs): void {
    this.selectedRecord.set(row);
    this.formMode.set('edit');
    this.visible = true;
  }

  view(row: Staffs): void {
    this.selectedRecord.set(row);
    this.formMode.set('view');
    this.visible = true;
  }

  delete(row: Staffs): void {
    this.staffService.delete(row.id).subscribe(() => this.fetchRecords());
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
