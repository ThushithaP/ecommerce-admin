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
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface Promotions {
  id: number;
  name: string;
  type: 'percentage' | 'fixed' | 'free_product';
  priority: number;
  start_date: string;
  end_date: string;
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
  start_date: Date | null;
  end_date: Date | null;
  is_active: boolean;
  rules: PromotionRule[];
  rewards: PromotionReward[];
}

export interface PromotionPayload {
  name: string;
  type: string;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  rules: PromotionRule[];
  rewards: PromotionReward[];
}