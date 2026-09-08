// id
// sku
// productName
// varientLabel
// warehouseName
// supplierName
// reservedQuantity
// availableQuantity
// costPrice
// sellingPrice
// effectivePrice
// batchNo
// manufacturedDate
// expiryDate
// created_at
// updated_at

import { FormControl, FormGroup } from "@angular/forms";

// quantity
// supplier
// variant
// warehouse


export interface Inventories {
    id:number;
    sku: string;
    productName: string;
    varientLabel: string;
    warehouseName: string;
    supplierName: string;
    reservedQuantity: string;
    availableQuantity: string;
    costPrice: number;
    sellingPrice: number;
    effectivePrice: string;
    batchNo: string;
    manufacturedDate: string;
    expiryDate: string;
    created_at: string;
    updated_at: string;
}

export interface Items {
  id: number | null;
  variant: number;
  quantity: number;
  batchNo: string;
  costPrice: number;
  sellingPrice: number;
  manufacturedDate: string | null;
  expiryDate: string | null;
}

export interface InventoryFormValues {
    warehouse: number | null;
    supplier: string | null;
    items:Items[]
}

export type InventoryItemGroup = FormGroup<{
  id: FormControl<number | null>;
  variant: FormControl<number>;
  quantity: FormControl<number>;
  batchNo: FormControl<string>;
  costPrice: FormControl<number>;
  sellingPrice: FormControl<number>;
  manufacturedDate: FormControl<Date | null>;
  expiryDate: FormControl<Date | null>;
}>;