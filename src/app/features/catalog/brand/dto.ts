import { MediaAsset } from "@shared/services/media/media.service";

export interface BrandFormValues {
    name: string;
    slug: string;
    logoId: string;
    description?: string;
    is_active?: boolean;
}

export interface Brands {
    id: number;
    name: string;
    slug: string;
    logo: MediaAsset | null; 
    logoId: MediaAsset | null;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}