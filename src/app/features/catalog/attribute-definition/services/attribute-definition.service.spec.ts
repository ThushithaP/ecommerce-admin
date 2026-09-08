import { TestBed } from '@angular/core/testing';

import { AttributeDefinitionService } from './attribute-definition.service';

describe('AttributeDefinitionService', () => {
  let service: AttributeDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
