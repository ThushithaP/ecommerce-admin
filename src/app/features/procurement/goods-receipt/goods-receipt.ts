import { Component, inject } from '@angular/core';
import { BaseRoutedCrudPage } from '@shared/base/pages/base-routed-crud-page.component';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { DataTable } from "@shared/components/data-table/data-table";
import { GoodsReceiptFormValues, GoodsReceipts } from './dto';
import { GoodsReceiptService } from './services/goods-receipt.service';

@Component({
  selector: 'app-goods-receipt',
  imports: [Button, IconField, InputIcon, InputText, DataTable],
  templateUrl: './goods-receipt.html',
  styleUrl: './goods-receipt.css',
})
export class GoodsReceipt extends BaseRoutedCrudPage<GoodsReceipts, GoodsReceiptFormValues> {
  protected readonly basePath = 'admin/procurement/goods-receipt/manage';
  protected readonly service = inject(GoodsReceiptService);
  protected readonly entityLabel = 'Goods Receipt';

  columns: TableColumn<GoodsReceipts>[] = [
    { key: 'receiptNo', label: 'Receipt No', sortable: true },
    { key: 'poNumber', label: 'PO Number', sortable: true },
    { key: 'supplierName', label: 'Supplier Name', sortable: false },
    { key: 'receivedByName', label: 'Received By', sortable: false },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<GoodsReceipts>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    // { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];
}