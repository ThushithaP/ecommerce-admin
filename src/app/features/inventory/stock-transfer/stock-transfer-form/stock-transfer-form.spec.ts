import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferForm } from './stock-transfer-form';

describe('StockTransferForm', () => {
  let component: StockTransferForm;
  let fixture: ComponentFixture<StockTransferForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTransferForm],
    }).compileComponents();

    fixture = TestBed.createComponent(StockTransferForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
