export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ListParams {
  page: number;
  pageSize: number;
  search: string;
  ordering: string;
  filters?: Record<string, any>;
}

export interface SelectOption {
  value: string;
  name: string;
}