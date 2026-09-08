export interface AttributeOptionItem {
    id?: number;
    value: string;
    sortOrder: number;
}

export interface AttributeOptions {
    id: number;
    attribute: number;
    options: AttributeOptionItem[];
    created_at: string;
    updated_at: string;
}

export interface AttributeOptionFormValues {
    attribute: number | null;
    options: AttributeOptionItem[];
}

export interface AttributeOptionRow {
    id: number;
    attribute: number;
    value: string;
    sortOrder: number;
    created_at: string;
    updated_at: string;
}

export interface AttributeOptionGroup {
    id: number;
    attribute: number;
    attribute_label: string;
    option_count: number;
    options: AttributeOptionItem[];
    updated_at: string | null;
}