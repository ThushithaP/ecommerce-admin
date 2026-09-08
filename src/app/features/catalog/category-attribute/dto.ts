export interface CategoryAttributeItem {
    id?: number;
    attribute: number;
    required: boolean;
    sortOrder: number;
}

export interface CategoryAttributeFormValues {
    category: number;
    options: CategoryAttributeItem[];
}

export interface CategoryAttributeBulkSyncPayload {
    category: number;
    options: CategoryAttributeItem[];
}

