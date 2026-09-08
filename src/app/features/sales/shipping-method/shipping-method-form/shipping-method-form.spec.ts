import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingMethodForm } from './shipping-method-form';

describe('ShippingMethodForm', () => {
  let component: ShippingMethodForm;
  let fixture: ComponentFixture<ShippingMethodForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingMethodForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingMethodForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
