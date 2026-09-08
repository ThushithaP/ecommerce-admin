// import { PaymentTerms } from '@features/procurement/payment-term/dto';

export interface PurchaseOrderItem {
  id: number;
  variant: number;
  sku: string;
  productName: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
}

export interface PurchaseOrderItemInput {
  id?: number;
  variant: number | null;
  quantityOrdered: number;
  unitCost: number;
}

export interface PurchaseOrders {
  id: string;
  poNumber: string;
  supplier: string;
  supplierName: string;
  warehouse: number;
  warehouseName: string;
  status: string;
  orderedAt: string | null;
  expectedDate: string | null;
  notes: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderFormValues {
  supplier: string | null;
  warehouse: number | null;
  status: string;
  orderedAt: string | null;
  expectedDate: string | null;
  notes: string;
  items: PurchaseOrderItemInput[];
}

// export interface PurchaseOrderListParams {
//   page?: number;
//   pageSize?: number;
//   search?: string;
//   ordering?: string;
//   filters?: Record<string, any>;
// }