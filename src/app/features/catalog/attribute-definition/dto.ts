export interface AttributeDefinitionFormValues {
    label: string;
    group: number | null;
    code: string;
    attributeType: string;
    dataType: string;
    defaultValue: string;
    filterable: boolean;
    required: boolean;
    unit: number | null;
    sortOrder: number;
    minLength: number | null;
    maxLength: number | null;
    min: number | null;
    max: number | null;
    minDate: Date | null;
    maxDate: Date | null;
    minSelections: number | null;
    maxSelections: number | null;
    pattern: string;
    step: number | null;
}

export interface AttributeDefinitions {
    id: number;
    label: string;
    filterable: boolean;
    group: number | null;
    code: string;
    attributeType: string;
    dataType: string;
    defaultValue: string;
    required: boolean;
    unit: number | null;
    sortOrder: number;
    created_at: string;
    updated_at: string;
    validationRules: {
        min_length?: number;
        max_length?: number;
        pattern?: string;
        min?: number;
        max?: number;
        step?: number;
        min_date?: string;
        max_date?: string;
        min_selections?: number;
        max_selections?: number;
    } | null;
}

export interface AttributeDefinitionPayload {
    label: string;
    code: string;
    group: number | null;
    attributeType: string;
    dataType: string;
    unit: number | null;
    defaultValue: string;
    filterable: boolean;
    required: boolean;
    sortOrder: number;
    validationRules: Record<string, any>;
}