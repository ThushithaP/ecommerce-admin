export interface RoleFormValues {
    name: string;
    description?: string;
    is_active?: boolean;
}

export interface Roles {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
