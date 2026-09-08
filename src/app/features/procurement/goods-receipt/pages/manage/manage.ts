import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormMode } from '@shared/types';
import { GoodsReceiptForm } from "../../goods-receipt-form/goods-receipt-form";

@Component({
  selector: 'app-manage',
  imports: [GoodsReceiptForm],
  templateUrl: './manage.html',
  styleUrl: './manage.css',
})
export class Manage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  readonly mode = signal<FormMode>('create');
  readonly id = signal<string | null>(null);

  ngOnInit(): void {
    const url = this.route.snapshot.url;
    const actionParam = url[2]?.path;
    
    if (actionParam === 'view') {
      this.mode.set('view');
      this.id.set(this.route.snapshot.paramMap.get('id'));
    } else if (actionParam === 'create') {
      this.mode.set('create');
    }
  }

}