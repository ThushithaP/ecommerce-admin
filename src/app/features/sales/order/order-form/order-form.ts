import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormMode } from '@shared/types';
import { OrderService } from '../services/order.service';
import { Orders } from '../dto';
import { Card } from "primeng/card";
import { TableModule } from "primeng/table";
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-order-form',
  imports: [Card, TableModule, DatePipe, NgClass],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css',
})
export class OrderForm implements OnInit{
  mode = input<FormMode>('create');
  id = input<string | null>(null);

  private readonly service = inject(OrderService);

  readonly record = signal<Orders| null>(null);

  fetchOrder(id:string):void {
    this.service.getById(id).subscribe({
      next:(order) => {
        this.record.set(order);
      },
      error:()=>{

      }
    })
  }

  ngOnInit():void {
    const id = this.id();
    if (id !== null) {
      this.fetchOrder(id);
    }
  }
}
