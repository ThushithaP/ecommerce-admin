import { Component, inject } from '@angular/core';
import { BaseRoutedCrudPage } from '@shared/base/pages/base-routed-crud-page.component';
import { DataTable } from '@shared/components/data-table/data-table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Image, ProductFormValues, Products } from './dto';
import { ProductService } from './services/product.service';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api'

@Component({
  selector: 'app-product',
  imports: [ButtonModule, DialogModule, InputTextModule, IconField, InputIcon, DataTable, Breadcrumb],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product extends BaseRoutedCrudPage<Products, ProductFormValues> {
  // private router = inject(Router);
  protected readonly service = inject(ProductService);
  protected readonly entityLabel = 'Product';
  protected readonly basePath = 'admin/product/manage';

  items: MenuItem[] = [{ icon: 'pi pi-box', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<Products>[] = [
    { key: 'images', label: 'Image', type: 'image',width: '80px',imageUrl: (images: Image[]) =>
    images.find(image => image.isPrimary)?.url
    ?? images[0]?.url
    ?? null ,imageAlt: (row) => row.name,},
    { key: 'name', label: 'Name', sortable: true },
    { key: 'brandName', label: 'Brand', sortable: true },
    { key: 'categoryPathName', label: 'Category Path', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Products>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

}
