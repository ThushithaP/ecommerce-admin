import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode } from '@shared/types';
import { PromotionPayload } from '../../dto';
import { PromotionForm } from "../../promotion-form/promotion-form";
import { PromotionService } from '../../services/promotion.service';
import { ToastService } from '@shared/services/toast/toast.service';

@Component({
  selector: 'app-manage',
  imports: [PromotionForm],
  templateUrl: './manage.html',
  styleUrl: './manage.css',
})
export class Manage implements OnInit {

  private readonly service = inject(PromotionService);
  private readonly toast = inject(ToastService);
  private router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly mode = signal<FormMode>('create');
  readonly id = signal<number | null>(null);

  ngOnInit(): void {
    const actionParam = this.route.snapshot.paramMap.get('action');
    this.id.set(Number(this.route.snapshot.paramMap.get('id')));
    if (actionParam === 'view') {
      this.mode.set('view');
    }
    if (actionParam === 'edit') {
      this.mode.set('edit');
    }
    if (actionParam === 'create') {
      this.mode.set('create');
    }
  }

  save(values: PromotionPayload): void {
    const request$ = this.mode() === 'edit'
      ? this.service.update(this.id()!, values)
      : this.service.create(values);

    request$.subscribe({
      next: () => {
        this.toast.success(`Supplier ${this.id() ? 'updated' : 'created'}.`);
        // this.router.navigate(['admin/procurement/supplier']);
      },
      error: () => {
        this.toast.error('Failed to save supplier.');
      },
    });
  }

  cancel():void {
    this.router.navigate(['admin/sales/promotion']);
  }
}
