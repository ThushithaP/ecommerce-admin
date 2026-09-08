export interface GoodsReceiptItem {
  id: number;
  purchaseOrderItem: number;
  sku: string;
  productName: string;
  quantityReceived: number;
  quantityAccepted: number;
  batchNo: string;
  manufacturedDate: string | null;
  expiryDate: string | null;
}

export interface GoodsReceiptItemInput {
  purchaseOrderItem: number;
  quantityReceived: number;
  quantityAccepted: number;
  batchNo: string;
  manufacturedDate: string | null;
  expiryDate: string | null;
}

export interface GoodsReceipts {
  id: string;
  receiptNo: string;
  purchaseOrder: string;
  poNumber: string;
  supplierName: string;
  receivedBy: string | null;
  receivedByName: string | null;
  receivedAt: string;
  notes: string;
  items: GoodsReceiptItem[];
  created_at: string;
  updated_at: string;
}

export interface GoodsReceiptFormValues {
  purchaseOrder: string | null;
  receivedBy: string | null;
  receivedAt: string | null;
  notes: string;
  items: GoodsReceiptItemInput[];
}
