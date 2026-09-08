
export interface StockTransferItem {
  id: number;
  variant: number;
  sku: string;
  productName: string;
  quantity: number;
  batchNo: string;
}

export interface StockTransfers {
  id: string;
  transferNo: string;
  from_warehouse: number;
  fromWarehouseName: string;
  to_warehouse: number;
  toWarehouseName: string;
  status: string;
  notes: string;
  items: StockTransferItem[];
  createdByName: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockTransferItemInput {
  variant: number | null;
  quantity: number;
  batchNo: string;
}

export interface StockTransferFormValues {
  from_warehouse: number | null;
  to_warehouse: number | null;
  notes: string;
  items: StockTransferItemInput[];
}