import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentForm } from './stock-adjustment-form';

describe('StockAdjustmentForm', () => {
  let component: StockAdjustmentForm;
  let fixture: ComponentFixture<StockAdjustmentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAdjustmentForm],
    }).compileComponents();

    fixture = TestBed.createComponent(StockAdjustmentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
