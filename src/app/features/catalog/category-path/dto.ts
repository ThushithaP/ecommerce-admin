export interface CreateCategoryPathDto {
    category_ids: number[];
}

export interface UpdateCategoryPathDto {
    category_ids: number[];
}

export interface CategoryPathFormValues {
  category_ids: number[];
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
  category_name: string;
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