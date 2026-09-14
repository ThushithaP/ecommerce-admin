export interface ModuleFormValues {
    name: string;
    code: string;
    description?: string;
    is_active?: boolean;
}

export interface Modules {
    id: string;
    name: string;
    code: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
