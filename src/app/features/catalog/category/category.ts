import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormMode } from '@shared/types';
import { formatDateTime, getFormTitle } from '@shared/utills';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { PageEvent, SortEvent, TableAction, TableColumn } from '@shared/models/table-column.model';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { DataTable } from "@shared/components/data-table/data-table";
import { ToastService } from '@shared/services/toast/toast.service';
import { CategoryService } from './services/category.service';
import { Categories, CategoryFormValues } from './dto';
import { CategoryForm } from "./components/category-form/category-form";
import { Router } from '@angular/router';
@Component({
  selector: 'app-category',
  imports: [ButtonModule, DialogModule, InputTextModule, IconField, InputIcon, DataTable, CategoryForm],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly toast = inject(ToastService);
  private router = inject(Router);

  visible: boolean = false;
  readonly dialogHeader = computed(() =>
    getFormTitle(this.formMode(), 'Category')
  );

  readonly formMode = signal<FormMode>('create');
  readonly selectedCategory = signal<Categories | null>(null);

  readonly records = signal<Categories[]>([]);
  readonly loading = signal(false);

  readonly totalCount = signal(0);
  readonly pageSize = signal(10);
  readonly pageIndex = signal(0);
  readonly sortColumn = signal('');
  readonly sortDirection = signal<'asc' | 'desc' | ''>('');
  readonly search = signal('');

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  columns: TableColumn<Categories>[] = [
    { key: 'name', label: 'Category Name', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Categories>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Attribute', color: 'default', icon: 'pi pi-asterisk', handler: (row) => this.navigateToAttributeOptions(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];


  fetchRecords(): void {
    this.loading.set(true);
    const ordering =
      this.sortDirection() && this.sortColumn()
        ? `${this.sortDirection() === 'desc' ? '-' : ''}${this.sortColumn()}`
        : '';

    this.categoryService.list({
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
    this.selectedCategory.set(null);
    this.formMode.set('create');
    this.visible = true;
  }

  edit(row: Categories): void {
    this.selectedCategory.set(row);
    this.formMode.set('edit');
    this.visible = true;
  }

  view(row: Categories): void {
    this.selectedCategory.set(row);
    this.formMode.set('view');
    this.visible = true;
  }

  delete(row: Categories): void {
    this.categoryService.delete(row.id).subscribe(() => this.fetchRecords())
  }

  save(values: CategoryFormValues): void {
    const module = this.selectedCategory();

    if (module) {
      // EDIT
      this.categoryService.update(module.id, values).subscribe({
        next: () => {
          this.visible = false;
          this.selectedCategory.set(null);
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
    this.categoryService.create(values).subscribe({
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

  navigateToAttributeOptions(row: Categories) {
    this.router.navigate(
      ['admin/category-attribute', row.id],
      {
        queryParams: {
          name: row.name
        }
      }
    );
  }
}