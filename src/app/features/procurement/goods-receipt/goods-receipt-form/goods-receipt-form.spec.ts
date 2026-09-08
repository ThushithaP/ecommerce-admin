import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptForm } from './goods-receipt-form';

describe('GoodsReceiptForm', () => {
  let component: GoodsReceiptForm;
  let fixture: ComponentFixture<GoodsReceiptForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoodsReceiptForm],
    }).compileComponents();

    fixture = TestBed.createComponent(GoodsReceiptForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
