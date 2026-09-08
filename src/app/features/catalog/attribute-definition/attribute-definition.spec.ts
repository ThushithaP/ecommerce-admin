import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeDefinition } from './attribute-definition';

describe('AttributeDefinition', () => {
  let component: AttributeDefinition;
  let fixture: ComponentFixture<AttributeDefinition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeDefinition],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeDefinition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
