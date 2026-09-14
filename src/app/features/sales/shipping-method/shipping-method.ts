import { Component, inject } from '@angular/core';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { ShippingMethodFormValues, ShippingMethods } from './dto';
import { ShippngMethodService } from './services/shippng-method.service';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { Dialog } from "primeng/dialog";
import { ShippingMethodForm } from "./shipping-method-form/shipping-method-form";
import { DataTable } from "@shared/components/data-table/data-table";
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-shipping-method',
  imports: [Button, IconField, InputIcon, InputText, Dialog, ShippingMethodForm, DataTable, Breadcrumb],
  templateUrl: './shipping-method.html',
  styleUrl: './shipping-method.css',
})
export class ShippingMethod extends BaseModalCrudPage<ShippingMethods,ShippingMethodFormValues> {
  protected readonly service = inject(ShippngMethodService);
  protected readonly entityLabel = 'Shipping Method';

  items: MenuItem[] = [{ icon: 'pi pi-truck', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<ShippingMethods>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'flatRate', label: 'Flat Rate', sortable: false },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<ShippingMethods>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];
}