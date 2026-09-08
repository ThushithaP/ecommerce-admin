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
import { AttributeGroupService } from './services/attribute-group.service';
import { AttributeGroups, AttributeGroupFormValues } from './dto';
import { AttributeGroupForm } from "./components/attribute-group-form/attribute-group-form";
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';

@Component({
  selector: 'app-attribute-group',
  imports: [ButtonModule, DialogModule, InputTextModule, IconField, InputIcon, DataTable, AttributeGroupForm],
  templateUrl: './attribute-group.html',
  styleUrl: './attribute-group.css',
})
export class AttributeGroup extends BaseModalCrudPage<AttributeGroups,AttributeGroupFormValues> {
  protected readonly service = inject(AttributeGroupService);
  protected readonly entityLabel = 'AttributeGroup';
  // private readonly toast = inject(ToastService);

  // visible: boolean = false;
  // readonly dialogHeader = computed(() =>
  //   getFormTitle(this.formMode(), 'Attribute Group')
  // );

  // readonly formMode = signal<FormMode>('create');
  // readonly selectedRecord = signal<AttributeGroups | null>(null);

  // readonly records = signal<AttributeGroups[]>([]);
  // readonly loading = signal(false);

  // readonly totalCount = signal(0);
  // readonly pageSize = signal(10);
  // readonly pageIndex = signal(0);
  // readonly sortColumn = signal('');
  // readonly sortDirection = signal<'asc' | 'desc' | ''>('');
  // readonly search = signal('');

  // private readonly searchSubject = new Subject<string>();
  // private readonly destroy$ = new Subject<void>();

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


  // fetchRecords(): void {
  //   this.loading.set(true);
  //   const ordering =
  //     this.sortDirection() && this.sortColumn()
  //       ? `${this.sortDirection() === 'desc' ? '-' : ''}${this.sortColumn()}`
  //       : '';

  //   this.attributeGroupService.list({
  //     page: this.pageIndex(),
  //     pageSize: this.pageSize(),
  //     search: this.search(),
  //     ordering,
  //   }).subscribe({
  //     next: (res) => {
  //       this.records.set(res.results);
  //       this.totalCount.set(res.count);
  //       this.loading.set(false);
  //     },
  //     error: () => {
  //       this.toast.error('Failed to retrieve.');
  //     },
  //   });
  // }

  // ngOnInit(): void {
  //   this.searchSubject
  //     .pipe(
  //       debounceTime(600),
  //       distinctUntilChanged(),
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe((value) => {
  //       this.search.set(value);
  //       this.pageIndex.set(0);
  //       this.fetchRecords();
  //     });
  //   this.fetchRecords();
  // }

  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }

  // open(): void {
  //   this.selectedRecord.set(null);
  //   this.formMode.set('create');
  //   this.visible = true;
  // }

  // edit(row: AttributeGroups): void {
  //   this.selectedRecord.set(row);
  //   this.formMode.set('edit');
  //   this.visible = true;
  // }

  // view(row: AttributeGroups): void {
  //   this.selectedRecord.set(row);
  //   this.formMode.set('view');
  //   this.visible = true;
  // }

  // delete(row: AttributeGroups): void {
  //   this.attributeGroupService.delete(row.id).subscribe(() => this.fetchRecords())
  // }

  // save(values: AttributeGroupFormValues): void {
  //   const module = this.selectedRecord();

  //   if (module) {
  //     // EDIT
  //     this.attributeGroupService.update(module.id, values).subscribe({
  //       next: () => {
  //         this.visible = false;
  //         this.selectedRecord.set(null);
  //         this.fetchRecords();
  //         this.toast.success('Updated Success')
  //       },
  //       error: () => {
  //         this.toast.error('Failed to create brand.');
  //       },
  //     });
  //     return;
  //   }

  //   // CREATE
  //   this.attributeGroupService.create(values).subscribe({
  //     next: () => {
  //       this.visible = false;
  //       this.fetchRecords();
  //     },
  //     error: () => {
  //       this.toast.error('Failed to create brand.');
  //     },
  //   });
  // }

  // onPageChange(e: PageEvent): void {
  //   this.pageIndex.set(e.pageIndex);
  //   this.pageSize.set(e.pageSize);
  //   this.fetchRecords();
  // }

  // onSortChange(e: SortEvent): void {
  //   this.sortColumn.set(e.column);
  //   this.sortDirection.set(e.direction);
  //   this.pageIndex.set(0);
  //   this.fetchRecords();
  // }

  // onSearch(value: string): void {
  //   this.searchSubject.next(value);
  // }

  // clearFilters(): void {
  //   this.search.set('');
  //   this.sortColumn.set('');
  //   this.sortDirection.set('');
  //   this.pageIndex.set(0);

  //   this.fetchRecords();
  // }
  onStatusFilterChange(status: string | null): void {
    this.updateFilters({ status });   // merges into filters signal + refetches
  }
}
