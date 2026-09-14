export interface CreateCategoryPathDto {
    categoryIds: number[];
}

export interface UpdateCategoryPathDto {
    categoryIds: number[];
}

export interface CategoryPathFormValues {
  categoryIds: number[];
}

export interface CategoryPathListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    ordering?: string;
}

// export interface CategoryPathCategory {
//     id: number;
//     name: string;
//     position: number;
// }

export interface CategoryPathItem {
  id: number;
  category: number;
  categoryName: string;
  position: number;
}

export interface CategoriesPath {
    id: number;
    full_path: string;
    path_depth: number;
    items: CategoryPathItem[];
    // categories: CategoryPathCategory[];

    created_at: string;
    updated_at: string;
}