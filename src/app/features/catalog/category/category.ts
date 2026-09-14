import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { formatDateTime } from '@shared/utills';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { DataTable } from "@shared/components/data-table/data-table";
import { CategoryService } from './services/category.service';
import { Categories, CategoryFormValues } from './dto';
import { CategoryForm } from "./components/category-form/category-form";
import { Router } from '@angular/router';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';

@Component({
  selector: 'app-category',
  imports: [Breadcrumb, ButtonModule, DialogModule, InputTextModule, IconField, InputIcon, DataTable, CategoryForm],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category extends BaseModalCrudPage<Categories, CategoryFormValues> {
  protected readonly service = inject(CategoryService);
  protected readonly entityLabel = 'Category';
  private router = inject(Router);

  items: MenuItem[] = [{ icon: 'pi pi-sitemap', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<Categories>[] = [
    { key: 'name', label: 'Category Name', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Categories>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Attribute', color: 'default', icon: 'pi pi-asterisk', handler: (row) => this.navigateToAttributeOptions(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

  navigateToAttributeOptions(row: Categories) {
    this.router.navigate(
      ['admin/category-attribute', row.id],
      { queryParams: { name: row.name }}
    );
  }
}