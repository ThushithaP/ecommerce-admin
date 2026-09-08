import { Component, inject } from '@angular/core';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { PaymentTermFormValues, PaymentTerms } from './dto';
import { PayementTermService } from './services/payement-term.service';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { Dialog } from "primeng/dialog";
import { PaymentTermForm } from "./payment-term-form/payment-term-form";
import { DataTable } from "@shared/components/data-table/data-table";
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'app-payment-term',
  imports: [Dialog, PaymentTermForm, DataTable, Button, IconField, InputIcon, InputText],
  templateUrl: './payment-term.html',
  styleUrl: './payment-term.css',
})
export class PaymentTerm extends BaseModalCrudPage<PaymentTerms, PaymentTermFormValues> {
  protected readonly service = inject(PayementTermService);
  protected readonly entityLabel = 'Payment Term';

  columns: TableColumn<PaymentTerms>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'days', label: 'Days', sortable: true },
  ]

  actions: TableAction<PaymentTerms>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

  onStatusFilterChange(status: string | null): void {
    this.updateFilters({ status });   // merges into filters signal + refetches
  }
}
