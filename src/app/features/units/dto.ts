
export interface UnitFormValues {
  name: string;
  symbol: string;
  code: string;
  unitType: string;
}

export interface Units {
  id: number;
  name: string;
  symbol: string;
  code: string;
  unitType: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUnitDto {
  name: string;
  symbol: string;
  code: string;
  unitType: string;
}
export type UpdateUnitDto = Partial<CreateUnitDto>;

export interface UnitListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  ordering?: string;
}