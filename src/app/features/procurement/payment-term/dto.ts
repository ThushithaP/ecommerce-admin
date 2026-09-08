export interface PaymentTermFormValues {
    name:string;
    days:number;
    description?:string | null;
}

export interface PaymentTerms {
    id: number;
    name:string;
    days:number;
    description?:string | null;
    created_at: string;
    updated_at: string;
}

export type UpdatePaymentTermDto = Partial<PaymentTermFormValues>;
