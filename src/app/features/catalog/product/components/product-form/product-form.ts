import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Button } from 'primeng/button';
import { ImageUploader } from '@shared/components/image-uploader/image-uploader';
import { getFieldError } from '@shared/utills/form-errors';
import { BrandService } from '@features/catalog/brand/services/brand.service';
import { Brands } from '@features/catalog/brand/dto';
import { CategoryPathService } from '@features/catalog/category-path/services/category-path.service';
import { CategoriesPath } from '@features/catalog/category-path/dto';
// import { TaxClassService } from '@features/tax/services/tax-class.service';
// import { TaxClasses } from '@features/tax/dto';
import { ProductService } from '../../services/product.service';
import { AttributeSchema, Image, ProductFormValues, ProductImageInput, Products } from '../../dto';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaAsset } from '@shared/services/media/media.service';
import { FormMode } from '@shared/types';

type SpecControlGroup = FormGroup<{
  attribute: FormControl<number>;
  value: FormControl<string | number | boolean | null>;
}>;

type VariantFormGroup = FormGroup<{
  id: FormControl<string | null>;
  sku: FormControl<string>;
  barcode: FormControl<string>;
  attributes: FormControl<Record<string, string>>;
  price: FormControl<number>;
  compareAtPrice: FormControl<number | null>;
  weight: FormControl<number | null>;
  status: FormControl<string>;
  // imageIds: FormControl<string[]>;
  images: FormControl<ProductImageInput[]>;
}>;

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormFieldComponent, Select, InputText, ToggleSwitch, Button, ImageUploader],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  save = output<ProductFormValues>();
  mode = input<FormMode>('create');

  private readonly fb = inject(FormBuilder);
  private readonly brandService = inject(BrandService);
  private readonly categoryPathService = inject(CategoryPathService);
  // private readonly taxClassService = inject(TaxClassService);
  private readonly productService = inject(ProductService);

  private readonly route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly brands = signal<Brands[]>([]);
  readonly categoryPaths = signal<CategoriesPath[]>([]);
  // readonly taxClasses = signal<TaxClasses[]>([]);
  readonly attributeSchema = signal<AttributeSchema[]>([]);
  readonly submitting = signal(false);

  readonly productId = signal<number | null>(null);
  readonly loadedProduct = signal<Products | null>(null);


  readonly specificationAttributes = computed(() =>
    this.attributeSchema().filter((a) => a.attributeType === 'specification')
  );
  readonly variantAttributes = computed(() =>
    this.attributeSchema().filter((a) => a.attributeType === 'variant')
  );

  readonly statusOptions = [
    { value: 'draft', name: 'Draft' },
    { value: 'active', name: 'Active' },
    { value: 'archived', name: 'Archived' },
  ];

  readonly form = this.fb.nonNullable.group({
    id: [this.loadedProduct()?.id],
    name: ['', [Validators.required, Validators.minLength(3)]],
    slug: [''],
    brand: [null as number | null, [Validators.required]],
    categoryPath: [null as CategoriesPath | null, [Validators.required]],
    taxClass: [null as number | null],
    status: ['draft', [Validators.required]],
    shortDescription: [''],
    description: [''],
    // images: this.fb.nonNullable.control<string[]>([]),
    images: this.fb.nonNullable.control<ProductImageInput[]>([]),
    // attributeValues: this.fb.array<ReturnType<typeof this.createSpecControl>>([]),
    // variants: this.fb.array<ReturnType<typeof this.createVariantGroup>>([]),
    attributeValues: this.fb.array<SpecControlGroup>([]),
    variants: this.fb.array<VariantFormGroup>([]),
  });

  get f() {
    return this.form.controls;
  }

  get attributeValuesArray(): FormArray<SpecControlGroup> {
    return this.form.controls.attributeValues;
  }

  get variantsArray(): FormArray<VariantFormGroup> {
    return this.form.controls.variants;
  }

  getError(control: any) {
    return getFieldError(control);
  }

  private createSpecControl(attribute: AttributeSchema): SpecControlGroup {
    const validators = attribute.required ? [Validators.required] : [];
    return this.fb.group({
      attribute: this.fb.nonNullable.control(attribute.id),
      value: this.fb.control<string | number | boolean | null>(attribute.defaultValue ?? null, validators),
    }) as SpecControlGroup;
  }

  private createVariantGroup(attributes: Record<string, string> = {}): VariantFormGroup {
    return this.fb.group({
      id: this.fb.control<string | null>(null), //for edit

      sku: this.fb.nonNullable.control('', [Validators.required]),
      barcode: this.fb.nonNullable.control(''),
      attributes: this.fb.nonNullable.control(attributes),
      price: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
      compareAtPrice: this.fb.control<number | null>(null),
      weight: this.fb.control<number | null>(null),
      status: this.fb.nonNullable.control('active', [Validators.required]),
      // imageIds: this.fb.nonNullable.control<string[]>([]),
      images: this.fb.nonNullable.control<ProductImageInput[]>([])
    }) as VariantFormGroup;
  }

  ngOnInit(): void {
    this.fetchBrands();
    this.fetchCategoryPaths();
    // this.fetchTaxClasses();
        
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId.set(Number(idParam));
      this.loadProduct(Number(idParam));
    }
  }

  constructor() {
    effect(() => {
      this.applyDisabledStateToArrays();
    })
  }

  private applyDisabledStateToArrays(): void {
    const shouldDisable = this.mode() === 'view';
    shouldDisable ? this.form.disable() : this.form.enable();
    shouldDisable ? this.variantsArray.disable() : this.variantsArray.enable();
    shouldDisable ? this.attributeValuesArray.disable() : this.attributeValuesArray.enable();
  }

  fetchBrands(): void {
    this.brandService.list({ page: 0, pageSize: 100, search: '', ordering: 'name', })
      .subscribe({ next: (res) => this.brands.set(res.results) });
  }

  fetchCategoryPaths(): void {
    this.categoryPathService.list({ pageSize: 100 })
      .subscribe({ next: (res) => this.categoryPaths.set(res.results) });
  }

  // fetchTaxClasses(): void {
  //   this.taxClassService.list({ page: 0, pageSize: 100, search: '', ordering: 'name', filters: {} })
  //     .subscribe({ next: (res) => this.taxClasses.set(res.results) });
  // }

  onCategoryPathSelected(path: CategoriesPath): void {
    const categoryIds = path.items.map((item) => item.category);

    this.productService.getAttributeSchema(categoryIds).subscribe({
      next: (schema) => {
        this.attributeSchema.set(schema);

        // rebuild specification fields based on the resolved schema
        this.attributeValuesArray.clear();
        schema
          .filter((a) => a.attributeType === 'specification')
          .forEach((attr) => this.attributeValuesArray.push(this.createSpecControl(attr)));
      },
    });
  }

  // ---- Variant generation from selected variant-attribute options ----

  selectedOptionsByAttribute = signal<Record<number, number[]>>({});

  toggleVariantOption(attributeId: number, optionId: number, checked: boolean): void {
    this.selectedOptionsByAttribute.update((map) => {
      const current = new Set(map[attributeId] ?? []);
      checked ? current.add(optionId) : current.delete(optionId);
      return { ...map, [attributeId]: [...current] };
    });
  }

  generateVariants(): void {
    const variantAttrs = this.variantAttributes();
    const selections = this.selectedOptionsByAttribute();

    const optionSets = variantAttrs
      .map((attr) => {
        const selectedIds = selections[attr.id] ?? [];
        const options = (attr.options ?? []).filter((o) => selectedIds.includes(o.id));
        return options.map((o) => ({ code: attr.code, value: o.value }));
      })
      .filter((set) => set.length > 0);

    if (optionSets.length === 0) return;

    const combinations = optionSets.reduce<Record<string, string>[]>(
      (acc, set) => acc.flatMap((combo) => set.map((item) => ({ ...combo, [item.code]: item.value }))),
      [{}]
    );

    this.variantsArray.clear();
    combinations.forEach((combo) => this.variantsArray.push(this.createVariantGroup(combo)));
    this.applyDisabledStateToArrays();
  }

  onVariantImagesChange(variantIndex: number, images: ProductImageInput[]): void {
    // this.variantsArray.at(variantIndex).controls.imageIds.setValue(assetIds);
    this.variantsArray.at(variantIndex).controls.images.setValue(images);  
  }

  removeVariant(index: number): void {
    this.variantsArray.removeAt(index);
  }

  onCancel(): void {
    this.router.navigate(['admin/product']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // this.submitting.set(true);
    const raw = this.form.getRawValue();

    const newRaw = {
      ...raw,
      categoryPath: raw.categoryPath?.id ?? null,
    };

    this.save.emit(newRaw);
    // emit / call service.create/update here, following your existing save() pattern
  }

  loadProduct(id: number): void {
    if (!this.productService.getById) {
      return;
    }
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.loadedProduct.set(product);
        this.populateForm(product);
      }
      // error: () => this.toast.error('Failed to load product.'),
    });
  }

  private populateForm(product: Products): void {
    const selectedPath = this.categoryPaths().find(
      cp => cp.id !== null && cp.id === product.categoryPath
    );
    
    const categoryIds: number[] = selectedPath?.full_path
      ? selectedPath.full_path.split('/').map(Number)
      : [];

    // 1. Basic fields
    this.form.patchValue({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      categoryPath: selectedPath,   // full object — matches p-select + onCategoryPathSelected expectations
      taxClass: product.taxClass,
      status: product.status,
      shortDescription: product.shortDescription,
      description: product.description,
      // images: product.images.map((img) => img.id),
      images: product.images.map((img) => ({ mediaAssetId: img.id, isPrimary: !!img.isPrimary })),
    });

    // 2. Re-trigger the attribute schema fetch for this category path,
    //    THEN map the product's saved attributeValues onto the resolved schema controls

    if (!product.categoryPath) {
      this.attributeSchema.set([]);
      this.attributeValuesArray.clear();
      return;
    }

    this.productService.getAttributeSchema(
      categoryIds
    ).subscribe({
      next: (schema) => {
        this.attributeSchema.set(schema);
        this.attributeValuesArray.clear();

        schema
          .filter((a) => a.attributeType === 'specification')
          .forEach((attr) => {
            const existing = product.attributeValues.find((av) => av.attribute === attr.id);
            const group = this.createSpecControl(attr);
            if (existing) {
              group.patchValue({ value: existing.value });
            }
            this.attributeValuesArray.push(group);
          });
      },
    });

    // // 3. Populate variants — including their id (for update, not re-create) and imageIds
    this.variantsArray.clear();
    product.variants.forEach((v) => {
      const group = this.createVariantGroup(v.attributes);

      group.patchValue({
        id: v.id,
        sku: v.sku,
        barcode: v.barcode ?? '',
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        weight: v.weight,
        status: v.status,
        // imageIds: v.images.map((img) => img.id),
        images: v.images.map((img) => ({ mediaAssetId: img.id, isPrimary: !!img.isPrimary })),
      });
      this.variantsArray.push(group);
    });

    this.applyDisabledStateToArrays();
  }

  readonly mainImages = computed<MediaAsset[] | null>(() => {
    const images = this.loadedProduct()?.images;
    return images && images.length ? images : null;
  });

  initialVariantImages(variantIndex: number): MediaAsset[] | null {
    const product = this.loadedProduct();
    if (!product) return null;

    const variantGroup = this.variantsArray.at(variantIndex);
    const variantId = variantGroup.controls.id.value;

    const matched = product.variants.find((v) => v.id === variantId);
    return matched?.images?.length ? matched.images : null;
  }
}