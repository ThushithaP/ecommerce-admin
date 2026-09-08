export interface SalesSummary {
    startDate: string;
    endDate: string;
    totalRevenue: number;
    orderCount: number;
    avgOrderValue: number;
}

export interface SalesByStatus {
    status: string;
    count: number;
    total: number;
}

export interface TopProduct {
    id: any;
    product_name: string;
    variant_sku: string;
    unitsSold: number;
    revenue: number;
}

export interface SalesByCategory {
    variant__product__category_path__items__category__name: string | null;
    unitsSold: number;
    revenue: number;
}

export interface PaymentMethodBreakdown {
    method: string;
    count: number;
    total: number;
}

export interface InventoryValuationByWarehouse {
    warehouse__name: string;
    units: number;
    costValue: number;
}

export interface InventoryValuation {
    totalUnits: number;
    totalCostValue: number;
    byWarehouse: InventoryValuationByWarehouse[];
}

export interface LowStockItem {
    id:any;
    sku: string;
    productName: string;
    warehouseName: string;
    availableQuantity: number;
    batchNo: string;
}

export interface ReportDateRange {
    startDate: Date | null;
    endDate: Date | null;
}

export interface DailyTrendPoint {
  date: string;
  revenue: number;
  orderCount: number;
}