import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponForm } from './coupon-form';

describe('CouponForm', () => {
  let component: CouponForm;
  let fixture: ComponentFixture<CouponForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
