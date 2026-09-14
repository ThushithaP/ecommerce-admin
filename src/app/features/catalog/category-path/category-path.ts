import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CategoryPathForm } from "./components/category-path-form/category-path-form";
import { Button } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { InputTextModule, InputText } from 'primeng/inputtext';
import { FormMode } from '@shared/types';
import { formatDateTime, getFormTitle } from '@shared/utills';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { PageEvent, SortEvent, TableAction, TableColumn } from '@shared/models/table-column.model';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { DataTable } from "@shared/components/data-table/data-table";
import { ToastService } from '@shared/services/toast/toast.service';
import { CategoriesPath, CategoryPathFormValues } from './dto';
import { CategoryPathService } from './services/category-path.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-category-path',
  imports: [Breadcrumb, CategoryPathForm, DialogModule, DataTable, Button, IconField, InputIcon, InputText],
  templateUrl: './category-path.html',
  styleUrl: './category-path.css',
})
export class CategoryPath implements OnInit {
  private readonly categoryPathService = inject(CategoryPathService);
  private readonly toast = inject(ToastService);
  protected readonly entityLabel = 'Category Path';

  items: MenuItem[] = [{ icon: 'pi pi-share-alt', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };


  visible: boolean = false;
  readonly dialogHeader = computed(() =>
    getFormTitle(this.formMode(), 'Category Path')
  );

  readonly formMode = signal<FormMode>('create');
  readonly selectedCategoryPath = signal<CategoriesPath | null>(null);

  readonly records = signal<CategoriesPath[]>([]);
  readonly loading = signal(false);

  readonly totalCount = signal(0);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly sortColumn = signal('');
  readonly sortDirection = signal<'asc' | 'desc' | ''>('');
  readonly search = signal('');

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  columns: TableColumn<CategoriesPath>[] = [
    { key: 'category_path_name', label: 'Category Path', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<CategoriesPath>[] = [
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

    this.categoryPathService.list({
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
    this.selectedCategoryPath.set(null);
    this.formMode.set('create');
    this.visible = true;
  }

  private openForm(row: CategoriesPath, mode: FormMode): void {
    this.categoryPathService.getById(row.id).subscribe({
      next: (res) => {
        this.selectedCategoryPath.set(res);
        this.formMode.set(mode);
        this.visible = true;
      },
    });
  }

  edit(row: CategoriesPath): void {
    this.openForm(row, 'edit');
  }

  view(row: CategoriesPath): void {
    this.openForm(row, 'view');
  }

  delete(row: CategoriesPath): void {
    this.categoryPathService.delete(row.id).subscribe(() => this.fetchRecords())
  }

  save(values: CategoryPathFormValues): void {
    const module = this.selectedCategoryPath();

    if (module) {
      // EDIT
      this.categoryPathService.update(module.id, values).subscribe({
        next: () => {
          this.visible = false;
          this.selectedCategoryPath.set(null);
          this.fetchRecords();
          this.toast.success('Updated Success')
        },
        error: () => {
          this.toast.error('Failed to create category.');
        },
      });
      return;
    }

    // CREATE
    this.categoryPathService.create(values).subscribe({
      next: () => {
        this.visible = false;
        this.fetchRecords();
      },
      error: () => {
        this.toast.error('Failed to create category.');
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
