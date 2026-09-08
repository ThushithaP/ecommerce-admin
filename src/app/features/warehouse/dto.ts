
export interface WarehouseFormValues {
    branch?:number|null;
    docName:string;
    name:string;
    code?:string | null;
    address?:string | null;
    phone:string;
    email:string;
}

export interface Warehouses {
    id: number;
    branch?: number |null;
    name: string;
    docName:string;
    code?:string | null;
    address?:string | null;
    phone: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export type UpdateWarehouseDto = Partial<WarehouseFormValues>;
