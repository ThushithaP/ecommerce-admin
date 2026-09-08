import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryForm } from "../../inventory-form/inventory-form";
import { InventoryService } from '../../services/inventory.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { FormMode } from '@shared/types';
import { InventoryFormValues } from '../../dto';

@Component({
  selector: 'app-manage',
  imports: [InventoryForm],
  templateUrl: './manage.html',
  styleUrl: './manage.css',
})
export class Manage implements OnInit {
  private readonly service = inject(InventoryService);
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
    } else {
      this.router.navigate(['/admin/inventory/inventory']);
    }
  }

  save(values: InventoryFormValues): void {
    if (this.mode() === 'edit' && !this.id()) {
      this.toast.error('Inventory ID is missing.');
      return;
    }

    const request$ = this.mode() === 'edit'
      ? this.service.update(this.id()!, values)
      : this.service.create(values);

    request$.subscribe({
      next: () => {
        this.toast.success(`Inventory ${this.id() ? 'updated' : 'created'}.`);
        // this.router.navigate(['/admin/inventory/inventory']);
      },
      error: () => {
        this.toast.error('Failed to save inventory.');
      },
    });
  }
}
