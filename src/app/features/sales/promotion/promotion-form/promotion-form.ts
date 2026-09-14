import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { getFieldError } from '@shared/utills/form-errors';
import { InputText } from 'primeng/inputtext';
import { Select, SelectFilterEvent } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { SelectOption } from '@shared/interfaces';

import { CategoryService } from '@features/catalog/category/services/category.service';
import { Categories } from '@features/catalog/category/dto';
import { BrandService } from '@features/catalog/brand/services/brand.service';
import { Brands } from '@features/catalog/brand/dto';
import { ProductService } from '@features/catalog/product/services/product.service';
import { Products } from '@features/catalog/product/dto';
import { ProductVariants } from '@features/catalog/product/dto';

import { Promotions, PromotionFormValues, PromotionPayload, PromotionRule, PromotionReward } from '../dto';
import { FormMode } from '@shared/types';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from '../services/promotion.service';

type RuleGroup = FormGroup<{
  id: FormControl<number | null>;
  category: FormControl<number | null>;
  brand: FormControl<number | null>;
  product: FormControl<number | null>;
  variant: FormControl<number | null>;
  minimumQty: FormControl<number | null>;
  minimumAmount: FormControl<number | null>;
}>;

type RewardGroup = FormGroup<{
  id: FormControl<number | null>;
  rewardType: FormControl<string>;
  discountType: FormControl<string | null>;
  discountValue: FormControl<number | null>;
  freeProduct: FormControl<number | null>;
  freeVariant: FormControl<number | null>;
  freeQty: FormControl<number | null>;
}>;

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputText, Select, DatePicker, Button, ToggleSwitch],
  templateUrl: './promotion-form.html',
  styleUrl: './promotion-form.css',
})
// extends BaseModalFormComponent<Promotions, PromotionFormValues, PromotionPayload>
export class PromotionForm implements OnInit {
  cancel = output<void>();
  save = output<PromotionPayload>();
  mode = input<FormMode>('create');

  protected readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);
  private route = inject(ActivatedRoute);

  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);
  private readonly productService = inject(ProductService);
  private readonly service = inject(PromotionService);

  readonly categories = signal<Categories[]>([]);
  readonly brands = signal<Brands[]>([]);
  readonly products = signal<Products[]>([]);
  readonly variants = signal<ProductVariants[]>([]);

  readonly record = signal<Promotions | null>(null);

  readonly id = signal<number | null>(null)

  readonly typeOptions: SelectOption[] = [
    { value: 'percentage', name: 'Percentage Discount' },
    { value: 'fixed', name: 'Fixed Amount Discount' },
    { value: 'free_product', name: 'Free Product (BOGO)' },
  ];

  readonly rewardTypeOptions: SelectOption[] = [
    { value: 'discount', name: 'Discount' },
    { value: 'free_product', name: 'Free Product' },
  ];

  readonly discountTypeOptions: SelectOption[] = [
    { value: 'percentage', name: 'Percentage' },
    { value: 'fixed', name: 'Fixed' },
  ];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', [Validators.required]],
    priority: [0, [Validators.required]],
    startDate: [null as Date | null, [Validators.required]],
    endDate: [null as Date | null, [Validators.required]],
    is_active: [true],
    rules: this.fb.array<RuleGroup>([]),
    rewards: this.fb.array<RewardGroup>([]),
  });

  get f() {
    return this.form.controls;
  }

  get rulesArray(): FormArray<RuleGroup> {
    return this.form.controls.rules;
  }

  get rewardsArray(): FormArray<RewardGroup> {
    return this.form.controls.rewards;
  }

  getError(control: AbstractControl) {
    return getFieldError(control);
  }

  private createRule(rule?: Partial<PromotionRule>): RuleGroup {
    return this.fb.group({
      id: this.fb.control<number | null>(rule?.id ?? null),
      category: this.fb.control<number | null>(rule?.category ?? null),
      brand: this.fb.control<number | null>(rule?.brand ?? null),
      product: this.fb.control<number | null>(rule?.product ?? null),
      variant: this.fb.control<number | null>(rule?.variant ?? null),
      minimumQty: this.fb.control<number | null>(rule?.minimumQty ?? null),
      minimumAmount: this.fb.control<number | null>(rule?.minimumAmount ?? null),
    }) as RuleGroup;
  }

  private createReward(reward?: Partial<PromotionReward>): RewardGroup {
    return this.fb.group({
      id: this.fb.control<number | null>(reward?.id ?? null),
      rewardType: this.fb.nonNullable.control(reward?.rewardType ?? 'discount', [Validators.required]),
      discountType: this.fb.control<string | null>(reward?.discountType ?? 'percentage'),
      discountValue: this.fb.control<number | null>(reward?.discountValue ?? null),
      freeProduct: this.fb.control<number | null>(reward?.freeProduct ?? null),
      freeVariant: this.fb.control<number | null>(reward?.freeVariant ?? null),
      freeQty: this.fb.control<number | null>(reward?.freeQty ?? null),
    }) as RewardGroup;
  }

  addRule(): void {
    this.rulesArray.push(this.createRule());
  }

  removeRule(index: number): void {
    this.rulesArray.removeAt(index);
  }

  addReward(): void {
    this.rewardsArray.push(this.createReward());
  }

  removeReward(index: number): void {
    this.rewardsArray.removeAt(index);
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.loadPromotion(Number(idParam));
    } else {
      // this.addItem();   // start with one empty row for create mode
    }
  }

  onCategoryFilter(event: SelectFilterEvent): void {
    const search = event.filter ?? '';
    this.categoryService.list({ search, page: 0, pageSize: 20, ordering: ''}).subscribe(response => 
      this.categories.set(response.results)
    );
  }
  
  onBrandFilter(event: SelectFilterEvent): void {
    const search = event.filter ?? '';
    this.brandService.list({ search, page: 0, pageSize: 20, ordering: ''}).subscribe(response => 
      this.brands.set(response.results)
    );
  }
  onProductFilter(event: SelectFilterEvent): void {
    const search = event.filter ?? '';
    this.productService.list({ search, page: 0, pageSize: 20, ordering: ''}).subscribe(response => 
      this.products.set(response.results)
    );
  }
  onProductVariantFilter(event: SelectFilterEvent): void {
    const search = event.filter ?? '';
    this.productService.listProductVariants({ search, page: 0, pageSize: 20, ordering: ''}).subscribe(response => 
      this.variants.set(response.results)
    );
  }

  private fetchLookups(categoryIds:number[],brandIds:number[],productIds:number[],variantIds:number[]): void {
    if (categoryIds.length) {
      this.categoryService.getByIds(categoryIds).subscribe({ next: (res) => this.categories.set(res.results) });
    }
    if (brandIds.length) {
      this.brandService.getByIds(brandIds).subscribe({ next: (res) => this.brands.set(res.results) });
    }
    if (productIds.length) {
      this.productService.getProductByIds(productIds).subscribe({ next: (res) => this.products.set(res.results) });
    }
    if (variantIds.length) {
      this.productService.getProductVarintByIds(variantIds).subscribe({ next: (res) => this.variants.set(res.results) });
    }

  }

  protected emptyValues(): PromotionFormValues {
    return {
      name: '', type: '', priority: 0, startDate: null, endDate: null, is_active: true,
      rules: [], rewards: [],
    };
  }

  protected recordToValues(record: Promotions): PromotionFormValues {
    return {
      name: record.name,
      type: record.type,
      priority: record.priority,
      startDate: new Date(record.startDate),
      endDate: new Date(record.endDate),
      is_active: record.is_active,
      rules: record.rules,
      rewards: record.rewards,
    };
  }

  resetForm(onCancel: boolean): void {
    // super.resetForm(onCancel);

    const record = this.record();
    if(record != null) {
      const categoryIds = [...new Set(record.rules.map(rule => rule.category).filter((id): id is number => id !== null))];
      const brandIds = [...new Set(record.rules.map(rule => rule.brand).filter((id): id is number => id !== null))];
      const productIds = [...new Set(record.rules.map(rule => rule.product).filter((id): id is number => id !== null))];
      const variantIds = [...new Set(record.rules.map(rule => rule.variant).filter((id): id is number => id !== null))];

      this.fetchLookups(categoryIds,brandIds,productIds,variantIds);
    }
    
    if (record && !onCancel) {
      this.form.reset(this.recordToValues(record));
    } else {
      this.form.reset(this.emptyValues());
    }

    const values = record && !onCancel ? this.recordToValues(record) : this.emptyValues();

    this.rulesArray.clear();
    values.rules.forEach((rule) => this.rulesArray.push(this.createRule(rule)));

    this.rewardsArray.clear();
    values.rewards.forEach((reward) => this.rewardsArray.push(this.createReward(reward)));
  }
  

  protected toPayload(raw: PromotionFormValues): PromotionPayload {
    return {
      name: raw.name,
      type: raw.type,
      priority: raw.priority,
      startDate: raw.startDate ? raw.startDate.toISOString() : null,
      endDate: raw.endDate ? raw.endDate.toISOString() : null,
      is_active: raw.is_active,
      rules: this.rulesArray.getRawValue().map((r) => ({
        id: r.id ?? undefined,
        category: r.category,
        brand: r.brand,
        product: r.product,
        variant: r.variant,
        minimumQty: r.minimumQty,
        minimumAmount: r.minimumAmount,
      })),
      rewards: this.rewardsArray.getRawValue().map((r) => ({
        id: r.id ?? undefined,
        rewardType: r.rewardType as 'discount' | 'free_product',
        discountType: r.discountType as 'percentage' | 'fixed' | null,
        discountValue: r.discountValue,
        freeProduct: r.freeProduct,
        freeVariant: r.freeVariant,
        freeQty: r.freeQty,
      })),
    };
  }

  loadPromotion(id: number): void {
    this.service.getById(id).subscribe({
      next: (promo) => {
        this.record.set(promo);
        this.resetForm(false);
        this.applyDisabledStateToArrays();
      },
      error: () => {

      }
    })
  }

  private applyDisabledStateToArrays(): void {
    const shouldDisable = this.mode() === 'view';
    shouldDisable ? this.form.disable() : this.form.enable();
    shouldDisable ? this.rulesArray.disable() : this.rulesArray.enable();
    shouldDisable ? this.rewardsArray.disable() : this.rewardsArray.enable();
  }

  constructor() {
    effect(() => {
      this.applyDisabledStateToArrays();
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue() as PromotionFormValues;
    const payload = this.toPayload(values)
    this.submitting.set(true);
    this.save.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}