import { PaymentTerms } from "../payment-term/dto";

export interface SupplierContactItem {
    id?: number;
    name: string;
    designation: string;
    email: string;
    phone: string;
    isPrimary: boolean;
}

export interface SupplierFormValues {
    supplierCode: string;
    supplierType: string;
    companyName: string;
    firstName: string;
    lastName: string;
    taxRegistrationNo: string;
    registrationNo: string;
    email: string;
    phone: string;
    website: string;
    creditLimit: number;
    creditPeriodDays: number;
    paymentTerms:number | null;
    currency: string;
    notes: string;
    contacts: SupplierContactItem[];

}

export interface Suppliers {
    id: string;
    supplierCode: string;
    supplierType: string;
    companyName: string;
    firstName: string;
    lastName: string;
    taxRegistrationNo: string;
    registrationNo: string;
    email: string;
    phone: string;
    website: string;
    creditLimit: number;
    creditPeriodDays: number;
    paymentTerms: PaymentTerms | null;
    currency: string;
    notes: string;
    contacts: SupplierContactItem[];
    created_at: string;
    updated_at: string;
}
