import { Component, inject } from '@angular/core';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { CustomerFormValues, CustomerPayload, Customers } from './dto';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Dialog } from "primeng/dialog";
import { DataTable } from "@shared/components/data-table/data-table";
import { InputText } from "primeng/inputtext";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CustomerService } from './services/customer.service';
import { CustomerForm } from "./components/customer-form/customer-form";

@Component({
  selector: 'app-customer',
  imports: [Button, IconField, InputIcon, Dialog, DataTable, InputText, CustomerForm, BreadcrumbModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer extends BaseModalCrudPage<Customers,CustomerPayload> {
  protected readonly service = inject(CustomerService);
  protected readonly entityLabel = 'Customer';

  items: MenuItem[] = [{ icon: 'pi pi-users', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home',routerLink:['/admin/dashboard'] };

  columns: TableColumn<Customers>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'loyaltyPoints', label: 'Loyalty Points', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<Customers>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];
}
