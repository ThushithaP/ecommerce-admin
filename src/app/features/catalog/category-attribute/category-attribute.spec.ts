import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAttribute } from './category-attribute';

describe('CategoryAttribute', () => {
  let component: CategoryAttribute;
  let fixture: ComponentFixture<CategoryAttribute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAttribute],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryAttribute);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
