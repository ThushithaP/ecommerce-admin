export interface CouponFormValues {
    promotion: number | null;
    code: string;
    usageLimit: number | null;
    customerLimit: number | null;
    start_date: Date | null;
    end_date: Date | null;
    is_active: boolean;
}

export interface CouponPayload {
    promotion: number | null;
    code: string;
    usageLimit: number | null;
    customerLimit: number | null;
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
}

export interface Coupons {
    id: number;
    promotion: number | null;
    code: string;
    usageLimit: number | null;
    customerLimit: number | null;
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
}