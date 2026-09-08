import { Component, inject } from '@angular/core';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { Dialog } from "primeng/dialog";
import { DataTable } from "@shared/components/data-table/data-table";
import { InputText } from "primeng/inputtext";
import { StockAdjustmentFormValue, StockAdjustments } from './dto';
import { StockAdjustmentService } from './services/stock-adjustment.service';
import { StockAdjustmentForm } from "./stock-adjustment-form/stock-adjustment-form";

@Component({
  selector: 'app-stock-adjustment',
  imports: [Button, IconField, InputIcon, InputText, Dialog, StockAdjustmentForm, DataTable],
  templateUrl: './stock-adjustment.html',
  styleUrl: './stock-adjustment.css',
})
export class StockAdjustment extends BaseModalCrudPage<StockAdjustments, StockAdjustmentFormValue> {
  protected readonly service = inject(StockAdjustmentService);
  protected readonly entityLabel = 'Stock Adjustment';

  columns: TableColumn<StockAdjustments>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<StockAdjustments>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

  onStatusFilterChange(status: string | null): void {
    this.updateFilters({ status });   // merges into filters signal + refetches
  }
}
