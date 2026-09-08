import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableAction, PageEvent, SortEvent } from '@shared/models/table-column.model';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, TooltipModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T extends { id: string | number }> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() actions: TableAction<T>[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No records found';

  // Pagination
  @Input() totalCount = 0;
  @Input() pageSize = 20;
  @Input() pageIndex = 0;
  @Input() serverSidePagination = true;

  // Sorting
  @Input() sortColumn = '';
  @Input() sortDirection: 'asc' | 'desc' | '' = '';

  // Row selection (optional)
  @Input() selectable = false;
  @Input() selectedIds: Set<string | number> = new Set();

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() rowClick = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<Set<string | number>>();

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize) || 1;
  }

  get startRow(): number {
    return this.totalCount === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get endRow(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalCount);
  }

  getCellValue(row: T, column: TableColumn<T>): any {
    const raw = this.resolvePath(row, column.key as string);
    return column.formatter ? column.formatter(raw, row) : raw;
  }

  private resolvePath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  }

  // onSort(column: TableColumn<T>): void {
  //   if (!column.sortable) return;

  //   let direction: 'asc' | 'desc' | '' = 'asc';
  //   if (this.sortColumn === column.key) {
  //     direction = this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? '' : 'asc';
  //   }
  //   this.sortColumn = direction ? (column.key as string) : '';
  //   this.sortDirection = direction;
  //   this.sortChange.emit({ column: this.sortColumn, direction });
  // }

  onSort(column: TableColumn<T>): void {
    if (!column.sortable) return;

    let direction: 'asc' | 'desc' | '' = 'asc';

    if (this.sortColumn === column.key) {
      direction =
        this.sortDirection === 'asc'
          ? 'desc'
          : this.sortDirection === 'desc'
            ? ''
            : 'asc';
    }

    const sortColumn = direction ? (column.key as string) : '';

    this.sortChange.emit({
      column: sortColumn,
      direction,
    });
  }
  onPageChange(newPageIndex: number): void {
    if (newPageIndex < 0 || newPageIndex >= this.totalPages) return;
    this.pageIndex = newPageIndex;
    this.pageChange.emit({ pageIndex: newPageIndex, pageSize: this.pageSize });
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 0;
    this.pageChange.emit({ pageIndex: 0, pageSize: size });
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.data.forEach((row) => this.selectedIds.add(row.id));
    } else {
      this.data.forEach((row) => this.selectedIds.delete(row.id));
    }
    this.selectionChange.emit(new Set(this.selectedIds));
  }

  toggleSelectRow(id: string | number, checked: boolean): void {
    checked ? this.selectedIds.add(id) : this.selectedIds.delete(id);
    this.selectionChange.emit(new Set(this.selectedIds));
  }

  isAllSelected(): boolean {
    return this.data.length > 0 && this.data.every((row) => this.selectedIds.has(row.id));
  }

  getVisibleActions(row: T): TableAction<T>[] {
    return this.actions.filter((a) => !a.visible || a.visible(row));
  }

  badgeClass(column: TableColumn<T>, value: any): string {
    return column.badgeMap?.[value] ?? 'badge-default';
  }

  trackByRow = (_: number, row: T) => row.id;

  // Page numbers to render (e.g. 1 ... 4 5 [6] 7 8 ... 20)
  get visiblePageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.pageIndex;
    const range = 2;
    const pages: number[] = [];
    for (let i = Math.max(0, current - range); i <= Math.min(total - 1, current + range); i++) {
      pages.push(i);
    }
    return pages;
  }
}
