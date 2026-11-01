import { Directive, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ToastService } from '@shared/services/toast/toast.service';
import { PageEvent, SortEvent } from '@shared/models/table-column.model';
import { ListParams, PaginatedResponse } from '@shared/interfaces';

// export interface PagedResult<T> {
//   results: T[];
//   count: number;
// }

export interface CrudService<TRecord, TFormValues> {
    list(params: ListParams): Observable<PaginatedResponse<TRecord>>;
    create(values: TFormValues): Observable<TRecord>;
    update(id: any, values: TFormValues): Observable<TRecord>;
    delete?(id: any): Observable<void>;
    getById?(id: any): Observable<TRecord>;
}

@Directive()
export abstract class BaseListPage<TRecord extends { id: any }, TFormValues>
    implements OnInit, OnDestroy {

    protected readonly toast = inject(ToastService);

    protected abstract readonly service: CrudService<TRecord, TFormValues>;
    protected abstract readonly entityLabel: string;

    readonly records = signal<TRecord[]>([]);
    readonly loading = signal(false);

    readonly totalCount = signal(0);
    readonly pageSize = signal(10);
    readonly pageIndex = signal(0);
    readonly sortColumn = signal('');
    readonly sortDirection = signal<'asc' | 'desc' | ''>('');
    readonly search = signal('');
    readonly filters = signal<Record<string, any>>({});

    private readonly searchSubject = new Subject<string>();
    protected readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.searchSubject
            .pipe(debounceTime(600), distinctUntilChanged(), takeUntil(this.destroy$))
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

        this.service
            .list({
                page: this.pageIndex(),
                pageSize: this.pageSize(),
                search: this.search(),
                ordering,
                filters: this.filters(),
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.records.set(res.results);
                    this.totalCount.set(res.count);
                    this.loading.set(false);
                },
                error: () => {
                    this.loading.set(false);
                    this.toast.error(`Failed to retrieve ${this.entityLabel.toLowerCase()}.`);
                },
            });
    }

    delete(row: TRecord): void {
        if (!this.service.delete) {
            return;
        }
        this.service.delete(row.id).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => this.fetchRecords(),
            error: () => this.toast.error(`Failed to delete ${this.entityLabel.toLowerCase()}.`),
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

    updateFilters(patch: Record<string, any>): void {
        this.filters.update((f) => ({ ...f, ...patch }));
        this.pageIndex.set(0);
        this.fetchRecords();
    }

    clearFilters(): void {
        this.search.set('');
        this.filters.set({});
        this.sortColumn.set('');
        this.sortDirection.set('');
        this.pageIndex.set(0);
        this.fetchRecords();
    }
}