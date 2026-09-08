import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeDefinitionForm } from './attribute-definition-form';

describe('AttributeDefinitionForm', () => {
  let component: AttributeDefinitionForm;
  let fixture: ComponentFixture<AttributeDefinitionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeDefinitionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeDefinitionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
