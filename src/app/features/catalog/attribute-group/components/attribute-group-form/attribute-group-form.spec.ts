import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeGroupForm } from './attribute-group-form';

describe('AttributeGroupForm', () => {
  let component: AttributeGroupForm;
  let fixture: ComponentFixture<AttributeGroupForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeGroupForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeGroupForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
