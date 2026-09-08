import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPathForm } from './category-path-form';

describe('CategoryPathForm', () => {
  let component: CategoryPathForm;
  let fixture: ComponentFixture<CategoryPathForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPathForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPathForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
