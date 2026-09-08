export interface AttributeGroupFormValues {
    name: string;
    sortOrder?: number;
}

export interface AttributeGroups {
    id: number;
    name: string;
    sortOrder: number;
    created_at: string;
    updated_at: string;
}

export interface CreateAttributeGroupDto {
    name: string;
    sortOrder?: number;
}
export type UpdateAttributeGroupDto = Partial<CreateAttributeGroupDto>;

export interface AttributeGroupListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  ordering?: string;
}