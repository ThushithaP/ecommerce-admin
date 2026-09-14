import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxClassForm } from './tax-class-form';

describe('TaxClassForm', () => {
  let component: TaxClassForm;
  let fixture: ComponentFixture<TaxClassForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxClassForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxClassForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
