import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeGroup } from './attribute-group';

describe('AttributeGroup', () => {
  let component: AttributeGroup;
  let fixture: ComponentFixture<AttributeGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
