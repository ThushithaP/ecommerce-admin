import { MediaAsset } from "@shared/services/media/media.service";

export interface BrandFormValues {
    name: string;
    slug: string;
    logo_id: string;
    description?: string;
    is_active?: boolean;
}

export interface Brands {
    id: number;
    name: string;
    slug: string;
    logo: MediaAsset | null; 
    logo_id: MediaAsset | null;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateBrandDto {
    name: string;
    slug: string;
    logo_id?: string | null;
    description?: string;
    is_active?: boolean;
}
export type UpdateBrandDto = Partial<CreateBrandDto>;

export interface BrandListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  ordering?: string;
}