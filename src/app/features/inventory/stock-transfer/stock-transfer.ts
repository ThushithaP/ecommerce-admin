import { Component, inject } from '@angular/core';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { StockTransferFormValues, StockTransfers } from './dto';
import { StockTransferService } from './services/stock-transfer.service';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { Dialog } from "primeng/dialog";
import { StockTransferForm } from "./stock-transfer-form/stock-transfer-form";
import { DataTable } from "@shared/components/data-table/data-table";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-stock-transfer',
  imports: [BreadcrumbModule, Button, IconField, InputIcon, InputText, Dialog, StockTransferForm, DataTable],
  templateUrl: './stock-transfer.html',
  styleUrl: './stock-transfer.css',
})
export class StockTransfer extends BaseModalCrudPage<StockTransfers, StockTransferFormValues> {
  protected readonly service = inject(StockTransferService);
  protected readonly entityLabel = 'Stock Transfer';

  items: MenuItem[] = [{ icon: 'pi pi-list', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<StockTransfers>[] = [
    { key: 'transferNo', label: 'Transfer No', sortable: true },
    { key: 'fromWarehouseName', label: 'From' },
    { key: 'toWarehouseName', label: 'To' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'created_at', label: 'Created', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<StockTransfers>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    // {
    //   label: '', tooltip: 'Complete', color: 'default', icon: 'pi pi-check',
    //   handler: (row) => this.completeTransfer(row),
    //   visible: (row) => row.status === 'pending',
    // },
  ];

  completeTransfer(row: StockTransfers): void {
    this.service.complete(row.id).subscribe({
      next: () => {
        this.toast.success('Transfer completed — stock moved.');
        this.fetchRecords();
      },
      error: () => this.toast.error('Failed to complete transfer.'),
    });
  }
}
