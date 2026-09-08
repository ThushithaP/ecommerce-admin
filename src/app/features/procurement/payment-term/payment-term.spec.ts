import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTerm } from './payment-term';

describe('PaymentTerm', () => {
  let component: PaymentTerm;
  let fixture: ComponentFixture<PaymentTerm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTerm],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentTerm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
