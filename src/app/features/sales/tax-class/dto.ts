export interface TaxRate {
  id?: number;
  name: string;
  rate: number;
  region: string;
  is_active: boolean;
}

export interface TaxClasses {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  rates: TaxRate[];
  created_at: string;
  updated_at: string;
}

export interface TaxClassFormValues {
  name: string;
  description: string;
  is_active: boolean;
  rates: TaxRate[];
}