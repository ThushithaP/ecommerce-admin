import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderForm } from "../../order-form/order-form";
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode } from '@shared/types';

@Component({
  selector: 'app-view',
  imports: [OrderForm],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class View implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly mode = signal<FormMode>('create');
  readonly id = signal<string | null>(null);

  ngOnInit(): void {
    const url = this.route.snapshot.url;
    const actionParam = url[1]?.path;
    
    if (actionParam === 'view') {
      this.mode.set('view');
      this.id.set(this.route.snapshot.paramMap.get('id'));
    } else {
      this.router.navigate(['/admin/sales/order']);
    }
  }
}
