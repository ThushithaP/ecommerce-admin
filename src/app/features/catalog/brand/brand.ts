import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { formatDateTime } from '@shared/utills';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { DataTable } from "@shared/components/data-table/data-table";
import { BrandForm } from './components/brand-form/brand-form';
import { BrandService } from './services/brand.service';
import { BrandFormValues, Brands } from './dto';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';

@Component({
  selector: 'app-brand',
  imports: [ButtonModule, DialogModule, InputTextModule, IconField, InputIcon, DataTable, BrandForm, Breadcrumb],
  templateUrl: './brand.html',
  styleUrl: './brand.css',
})
export class Brand extends BaseModalCrudPage<Brands, BrandFormValues> {
  protected readonly service = inject(BrandService);
  protected readonly entityLabel = 'Brands';

  items: MenuItem[] = [{ icon: 'pi pi-tag', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<Brands>[] = [
    { key: 'name', label: 'Brand Name', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Brands>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];
}
