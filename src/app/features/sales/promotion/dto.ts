export interface PromotionRule {
  id?: number;
  category: number | null;
  brand: number | null;
  product: number | null;
  variant: number | null;
  minimumQty: number | null;
  minimumAmount: number | null;
}

export interface PromotionReward {
  id?: number;
  rewardType: 'discount' | 'free_product';
  discountType: 'percentage' | 'fixed' | null;
  discountValue: number | null;
  freeProduct: number | null;
  freeVariant: number | null;
  freeQty: number | null;
}

export interface Coupon {
  id: number;
  code: string;
  usageLimit: number | null;
  usageCount: number;
  customerLimit: number | null;
  startDate: string;
  endDate: string;
  is_active: boolean;
}

export interface Promotions {
  id: number;
  name: string;
  type: 'percentage' | 'fixed' | 'free_product';
  priority: number;
  startDate: string;
  endDate: string;
  is_active: boolean;
  rules: PromotionRule[];
  rewards: PromotionReward[];
  coupons: Coupon[];
  created_at: string;
  updated_at: string;
}

export interface PromotionFormValues {
  name: string;
  type: string;
  priority: number;
  startDate: Date | null;
  endDate: Date | null;
  is_active: boolean;
  rules: PromotionRule[];
  rewards: PromotionReward[];
}

export interface PromotionPayload {
  name: string;
  type: string;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  is_active: boolean;
  rules: PromotionRule[];
  rewards: PromotionReward[];
}