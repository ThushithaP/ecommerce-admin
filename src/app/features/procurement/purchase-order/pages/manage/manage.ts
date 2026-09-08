import { Component, inject, OnInit, signal } from '@angular/core';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode } from '@shared/types';
import { PurchaseOrderFormValues } from '../../dto';
import { PurchaseOrderForm } from "../../purchase-order-form/purchase-order-form";

@Component({
  selector: 'app-manage',
  imports: [PurchaseOrderForm],
  templateUrl: './manage.html',
  styleUrl: './manage.css',
})
export class Manage implements OnInit {

  private readonly service = inject(PurchaseOrderService);
  private readonly toast = inject(ToastService);
  private router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly mode = signal<FormMode>('create');
  readonly id = signal<string | null>(null);

  ngOnInit(): void {
    const actionParam = this.route.snapshot.paramMap.get('action');
    this.id.set(this.route.snapshot.paramMap.get('id'));
    if (actionParam === 'view') {
      this.mode.set('view');
    } else if (actionParam === 'edit') {
      this.mode.set('edit');
    } else if (actionParam === 'create') {
      this.mode.set('create');
    } else{
      this.router.navigate(['/admin/procurement/purchase-order']);
    }
  }

  save(values: PurchaseOrderFormValues): void {
    if (this.mode() === 'edit' && !this.id()) {
      this.toast.error('Purchase order ID is missing.');
      return;
    }

    const request$ = this.mode() === 'edit'
      ? this.service.update(this.id()!, values)
      : this.service.create(values);

    request$.subscribe({
      next: () => {
        this.toast.success(`Purchase order ${this.id() ? 'updated' : 'created'}.`);
        this.router.navigate(['/admin/procurement/purchase-order']);
      },
      error: () => {
        this.toast.error('Failed to save purchase order.');
      },
    });
  }
}