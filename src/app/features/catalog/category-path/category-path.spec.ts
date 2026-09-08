import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPath } from './category-path';

describe('CategoryPath', () => {
  let component: CategoryPath;
  let fixture: ComponentFixture<CategoryPath>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPath],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPath);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
