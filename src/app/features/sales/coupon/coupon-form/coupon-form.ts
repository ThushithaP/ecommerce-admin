import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { getFieldError } from '@shared/utills/form-errors';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { Coupons, CouponFormValues, CouponPayload } from '../dto';
import { Promotions } from '@features/sales/promotion/dto';
import { PromotionService } from '@features/sales/promotion/services/promotion.service';

@Component({
  selector: 'app-coupon-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputText, Select, DatePicker, Button, ToggleSwitch],
  templateUrl: './coupon-form.html',
  styleUrl: './coupon-form.css',
})
export class CouponForm extends BaseModalFormComponent<Coupons, CouponFormValues, CouponPayload> implements OnInit {
  private readonly promotionService = inject(PromotionService);
  readonly promotions = signal<Promotions[]>([]);

  readonly form = this.fb.nonNullable.group({
    promotion: [null as number | null, [Validators.required]],
    code: ['', [Validators.required]],
    usageLimit: [null as number | null],
    customerLimit: [null as number | null],
    start_date: [null as Date | null, [Validators.required]],
    end_date: [null as Date | null, [Validators.required]],
    is_active: [true],
  });

  override get f() {
    return this.form.controls;
  }

  override getError(control: AbstractControl) {
    return getFieldError(control);
  }

  ngOnInit(): void {
    this.promotionService.list({ page: 0, pageSize: 100, search: '', ordering: 'name', filters: {} })
      .subscribe({ next: (res) => this.promotions.set(res.results) });
  }

  protected emptyValues(): CouponFormValues {
    return {
      promotion: null, code: '', usageLimit: null, customerLimit: null,
      start_date: null, end_date: null, is_active: true,
    };
  }

  protected recordToValues(record: Coupons): CouponFormValues {
    return {
      promotion: (record as any).promotion ?? null,
      code: record.code,
      usageLimit: record.usageLimit,
      customerLimit: record.customerLimit,
      start_date: record.start_date ? new Date(record.start_date) : null,
      end_date: record.end_date ? new Date(record.end_date) : null,
      is_active: record.is_active,
    };
  }

  protected override toPayload(raw: CouponFormValues): CouponPayload {
    return {
      promotion: raw.promotion,
      code: raw.code.toUpperCase(),
      usageLimit: raw.usageLimit,
      customerLimit: raw.customerLimit,
      start_date: raw.start_date ? raw.start_date.toISOString() : null,
      end_date: raw.end_date ? raw.end_date.toISOString() : null,
      is_active: raw.is_active,
    };
  }
}