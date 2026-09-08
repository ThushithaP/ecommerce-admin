import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTermForm } from './payment-term-form';

describe('PaymentTermForm', () => {
  let component: PaymentTermForm;
  let fixture: ComponentFixture<PaymentTermForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTermForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentTermForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
