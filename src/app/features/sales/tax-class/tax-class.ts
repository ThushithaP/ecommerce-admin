import { Component, inject } from '@angular/core';

import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { Dialog } from "primeng/dialog";
import { DataTable } from "@shared/components/data-table/data-table";
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { TaxClasses, TaxClassFormValues } from './dto';
import { TaxClassService } from './services/tax-class.service';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { TaxClassForm } from './tax-class-form/tax-class-form';
@Component({
  selector: 'app-tax-class',
  imports: [Button, IconField, InputIcon, InputText, Dialog, DataTable, Breadcrumb, TaxClassForm],
  templateUrl: './tax-class.html',
  styleUrl: './tax-class.css',
})
export class TaxClass extends BaseModalCrudPage<TaxClasses,TaxClassFormValues> { 

  protected readonly service = inject(TaxClassService);
  protected readonly entityLabel = 'Tax Class';

  items: MenuItem[] = [{ icon: 'pi pi-truck', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<TaxClasses>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'rates.length', label: 'No. of Tax Rate(s)', sortable: false },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<TaxClasses>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

}
