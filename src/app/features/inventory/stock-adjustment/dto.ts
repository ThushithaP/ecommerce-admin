export interface StockAdjustments {
  id: number;
  inventory: number;
  sku: string;
  warehouseName: string;
  quantityDelta: number;
  reason: string;
  notes: string;
  createdByName: string | null;
  created_at: string;
}

export interface StockAdjustmentFormValue {
  inventory: number;
  quantityDelta: number;
  reason: string;
  notes: string;
}
