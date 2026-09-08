// import { Directive, computed, signal } from '@angular/core';
// import { takeUntil } from 'rxjs';
// import { FormMode } from '@shared/types';
// import { getFormTitle } from '@shared/utills';
// import { BaseListPage } from './base-list-page.component';

// @Directive()
// export abstract class BaseModalCrudPage<TRecord extends { id: any }, TFormValues>
//   extends BaseListPage<TRecord, TFormValues> {

//   visible = false;
//   readonly formMode = signal<FormMode>('create');
//   readonly selectedRecord = signal<TRecord | null>(null);
//   readonly dialogHeader = computed(() => getFormTitle(this.formMode(), this.entityLabel));

//   open(): void {
//     this.selectedRecord.set(null);
//     this.formMode.set('create');
//     this.visible = true;
//   }

//   edit(row: TRecord): void {
//     this.formMode.set('edit');
//     this.loadRecordThenOpen(row);
//   }

//   view(row: TRecord): void {
//     this.formMode.set('view');
//     this.loadRecordThenOpen(row);
//   }

//   protected loadRecordThenOpen(row: TRecord): void {
//     if (this.service.getById) {
//       this.service.getById(row.id).pipe(takeUntil(this.destroy$)).subscribe({
//         next: (full) => {
//           this.selectedRecord.set(full);
//           this.visible = true;
//         },
//         error: () => this.toast.error(`Failed to load ${this.entityLabel.toLowerCase()}.`),
//       });
//       return;
//     }
//     this.selectedRecord.set(row);
//     this.visible = true;
//   }

//   save(values: TFormValues): void {
//     const record = this.selectedRecord();
//     const request$ = record
//       ? this.service.update(record.id, values)
//       : this.service.create(values);

//     request$.pipe(takeUntil(this.destroy$)).subscribe({
//       next: () => {
//         this.visible = false;
//         this.selectedRecord.set(null);
//         this.fetchRecords();
//         this.toast.success(`${record ? 'Updated' : 'Created'} successfully.`);
//       },
//       error: () => {
//         this.toast.error(`Failed to ${record ? 'update' : 'create'} ${this.entityLabel.toLowerCase()}.`);
//       },
//     });
//   }
// }

import { Directive, computed, signal } from '@angular/core';
import { takeUntil } from 'rxjs';
import { FormMode } from '@shared/types';
import { getFormTitle } from '@shared/utills';
import { BaseListPage } from './base-list-page.component';

@Directive()
export abstract class BaseModalCrudPage<TRecord extends { id: any }, TPayload>
  extends BaseListPage<TRecord, TPayload> {

  visible = false;
  readonly formMode = signal<FormMode>('create');
  readonly selectedRecord = signal<TRecord | null>(null);
  readonly dialogHeader = computed(() => getFormTitle(this.formMode(), this.entityLabel));

  open(): void {
    this.selectedRecord.set(null);
    this.formMode.set('create');
    this.visible = true;
  }

  edit(row: TRecord): void {
    this.formMode.set('edit');
    this.loadRecordThenOpen(row);
  }

  view(row: TRecord): void {
    this.formMode.set('view');
    this.loadRecordThenOpen(row);
  }

  protected loadRecordThenOpen(row: TRecord): void {
    if (this.service.getById) {
      this.service.getById(row.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (full) => {
          this.selectedRecord.set(full);
          this.visible = true;
        },
        error: () => this.toast.error(`Failed to load ${this.entityLabel.toLowerCase()}.`),
      });
      return;
    }
    this.selectedRecord.set(row);
    this.visible = true;
  }

  save(values: TPayload): void {
    const record = this.selectedRecord();
    const request$ = record
      ? this.service.update(record.id, values)
      : this.service.create(values);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.visible = false;
        this.selectedRecord.set(null);
        this.fetchRecords();
        this.toast.success(`${record ? 'Updated' : 'Created'} successfully.`);
      },
      error: () => {
        this.toast.error(`Failed to ${record ? 'update' : 'create'} ${this.entityLabel.toLowerCase()}.`);
      },
    });
  }
}