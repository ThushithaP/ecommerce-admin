// core/pages/base-routed-crud-page.component.ts
import { Directive, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseListPage } from './base-list-page.component';

@Directive()
export abstract class BaseRoutedCrudPage<TRecord extends { id: any }, TFormValues>
  extends BaseListPage<TRecord, TFormValues> {

  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  /** Override if your routes differ, e.g. 'staff/:id/edit' vs 'units/:id' */
  protected abstract readonly basePath: string;

  add(): void {
    this.router.navigate([this.basePath, 'create']);
  }

  edit(row: TRecord): void {
    this.router.navigate([this.basePath, 'edit', row.id]);
  }

  view(row: TRecord): void {
    this.router.navigate([this.basePath,'view', row.id]);
  }
}