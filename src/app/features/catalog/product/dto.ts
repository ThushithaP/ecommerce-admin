export interface AttributeSchemaOption {
  id: number;
  value: string;
  sortOrder: number;
}

export interface AttributeSchema {
  id: number;
  label: string;
  code: string;
  attributeType: 'variant' | 'specification';
  dataType: string;
  unit: number | null;
  defaultValue: string | null;
  filterable: boolean;
  required: boolean;
  validationRules: Record<string, any> | null;
  sortOrder: number;
  options: AttributeSchemaOption[] | null;
}

export interface ProductImageInput {
  mediaAssetId: string;
  isPrimary: boolean;
}

export interface ProductFormValues {
  name: string;
  slug: string;
  brand: number | null;
  categoryPath: number | null;
  taxClass: number | null;
  shortDescription: string;
  description: string;
  status: string;
  // images: string[];
  images: ProductImageInput[];
  attributeValues: ProductAttributeValue[];
  variants: ProductVariant[];
}

export interface ProductAttributeValue {
  attribute: number;
  value: string | number | boolean | null;
}

export interface ProductVariant {
  sku: string;
  barcode: string;
  attributes: Record<string, string>;
  price: number;
  compareAtPrice: number | null;
  weight: number | null;
  status: string;
  // imageIds: string[];
  images: ProductImageInput[]; 
}

export interface EditProductVariant {
  id:string;

  sku: string;
  barcode: string;
  attributes: Record<string, string>;
  price: number;
  compareAtPrice: number | null;
  weight: number | null;
  status: string;
  images: Image[];
}

export interface Image {
  id: string
  url: string
  status: string
  content_type: string;
  created_at: string;
  object_key: string;
  original_filename: string;
  isPrimary: boolean;
}

export interface Products {
  id: number;
  name: string;
  slug: string;
  brand: number | null;
  brandName: string;
  categoryPath: number | null;
  categoryPathName: string;
  taxClass: number | null;
  shortDescription: string;
  description: string;
  status: string;
  images: Image[];
  attributeValues: ProductAttributeValue[];
  variants: EditProductVariant[];
  created_at: string;
  updated_at: string;
}


// ProductVariants
export interface ProductVariants {
  id: number;
  sku: string;
  barcode: string | null;
  product: number;
  productName: string;
  brandName: string | null;
  attributes: Record<string, string>;
  price: number;
  status: string;
  displayLabel: string;
}