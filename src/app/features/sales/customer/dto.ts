export interface CustomerFormValues {
    name: string;
    email: string;
    phone: string;
    dob: Date | null;
}
export interface CustomerPayload {
    name: string;
    email: string;
    phone: string;
    dob: string | null;      // API shape — 'YYYY-MM-DD' string, matches DRF DateField
}

export interface Customers {
    id: string;
    name: string;
    email: string;
    phone: string;
    dob: Date | null;
    loyaltyPoints: number;
    created_at: string;
    updated_at: string;
}