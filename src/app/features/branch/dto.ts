export interface BranchFormValues {
    name:string;
    docName:string;
    code?:string | null;
    address:string;
    city:string;
    phone:string;
    email:string;
    defaultWh:boolean;
}

export interface Branches {
    id: number;
    name: string;
    docName: string;
    code?:string | null;
    address: string;
    city: string;
    phone: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export type UpdateBranchDto = Partial<BranchFormValues>;
