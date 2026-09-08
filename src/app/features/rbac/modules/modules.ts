import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Button } from "primeng/button";
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ModuleForm } from "./components/module-form/module-form";
import { FormMode } from '@shared/types';
import { getFormTitle } from '@shared/utills';
import { ModuleService } from './service/module.service';
import { Module, ModuleFormValues } from './dto';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { PageEvent, SortEvent, TableAction, TableColumn } from '@shared/models/table-column.model';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { DataTable } from "@shared/components/data-table/data-table";
import { ToastService } from '@shared/services/toast/toast.service';

@Component({
  selector: 'app-modules',
  imports: [ButtonModule, DialogModule, InputTextModule, ModuleForm, IconField, InputIcon, DataTable],
  templateUrl: './modules.html',
  styleUrl: './modules.css',
})
export class Modules implements OnInit {
  private readonly moduleService = inject(ModuleService);
  private readonly toast = inject(ToastService);

  visible: boolean = false;
  readonly dialogHeader = computed(() =>
    getFormTitle(this.formMode(), 'Module')
  );

  readonly formMode = signal<FormMode>('create');
  readonly selectedModule = signal<Module | null>(null);

  readonly records = signal<Module[]>([]);
  readonly loading = signal(false);

  readonly totalCount = signal(0);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly sortColumn = signal('');
  readonly sortDirection = signal<'asc' | 'desc' | ''>('');
  readonly search = signal('');

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  columns: TableColumn<Module>[] = [
    { key: 'name', label: 'Module Name', sortable: true },
    { key: 'code', label: 'Module Code', sortable: true },
    // { key: 'is_active', label: 'Status', type: 'boolean', },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: (v) => new Date(v).toLocaleDateString() },
  ];

  actions: TableAction<Module>[] = [
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

    this.moduleService.list({
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
    this.selectedModule.set(null);
    this.formMode.set('create');
    this.visible = true;
  }

  edit(row: Module): void {
    this.selectedModule.set(row);
    this.formMode.set('edit');
    this.visible = true;
  }

  view(row: Module): void {
    this.selectedModule.set(row);
    this.formMode.set('view');
    this.visible = true;
  }

  delete(row: Module): void {
    this.moduleService.delete(row.id).subscribe(() => this.fetchRecords())
  }

  save(values: ModuleFormValues): void {
    const module = this.selectedModule();

    if (module) {
      // EDIT
      this.moduleService.update(module.id, values).subscribe({
        next: () => {
          this.visible = false;
          this.selectedModule.set(null);
          this.fetchRecords();
          this.toast.success('Updated Success')
        },
        error: () => {
          this.toast.error('Failed to create role.');
        },
      });
      return;
    }

    // CREATE
    this.moduleService.create(values).subscribe({
      next: () => {
        this.visible = false;
        this.fetchRecords();
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
