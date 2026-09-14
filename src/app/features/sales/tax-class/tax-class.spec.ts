import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxClass } from './tax-class';

describe('TaxClass', () => {
  let component: TaxClass;
  let fixture: ComponentFixture<TaxClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxClass],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxClass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
