import { Component, inject } from '@angular/core';
import { BaseRoutedCrudPage } from '@shared/base/pages/base-routed-crud-page.component';
import { PromotionPayload, Promotions } from './dto';
import { PromotionService } from './services/promotion.service';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { DataTable } from "@shared/components/data-table/data-table";

@Component({
  selector: 'app-promotion',
  imports: [Button, IconField, InputIcon, InputText, BreadcrumbModule, DataTable],
  templateUrl: './promotion.html',
  styleUrl: './promotion.css',
})
export class Promotion extends BaseRoutedCrudPage<Promotions, PromotionPayload> {
  protected readonly basePath = 'admin/sales/promotion/manage';
  protected readonly service = inject(PromotionService);
  protected readonly entityLabel = 'Promotion';

  items: MenuItem[] = [{ icon: 'pi pi-megaphone', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<Promotions>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'startDate', label: 'Start Date', type: 'date', formatter: formatDateTime },
    { key: 'endDate', label: 'End Date', type: 'date', formatter: formatDateTime },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Promotions>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];
}
