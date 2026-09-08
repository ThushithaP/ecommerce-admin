import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductForm } from "../../components/product-form/product-form";
import { ProductFormValues } from '../../dto';
import { ProductService } from '../../services/product.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode } from '@shared/types';

@Component({
  selector: 'app-manage',
  imports: [ProductForm],
  templateUrl: './manage.html',
  styleUrl: './manage.css',
})
export class Manage implements OnInit {

  private readonly service = inject(ProductService);
  private readonly toast = inject(ToastService);
  private router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly mode = signal<FormMode>('create');
  readonly productId = signal<number | null>(null);

  ngOnInit(): void {
    const actionParam = this.route.snapshot.paramMap.get('action');
    this.productId.set(Number(this.route.snapshot.paramMap.get('id')));
    if(actionParam === 'view'){
      this.mode.set('view');
    }
    if(actionParam === 'edit'){
      this.mode.set('edit');
    }
    if(actionParam === 'create'){
      this.mode.set('create');
    }
  }

  save(values: ProductFormValues): void {
    if (this.mode() === 'create') {
      this.service.create(values).subscribe({
        next: () => {
          this.toast.success('Product added successfully.')
          this.router.navigate(['admin/product']);
        }
      });
    }
    if (this.mode() === 'edit') {
      this.service.update(this.productId(), values).subscribe({
        next: () => {
          this.toast.success('Product added successfully.')
        }
      });
    }

  }
}
