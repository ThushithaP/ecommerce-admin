import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeOption } from './attribute-option';

describe('AttributeOption', () => {
  let component: AttributeOption;
  let fixture: ComponentFixture<AttributeOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeOption],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeOption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
