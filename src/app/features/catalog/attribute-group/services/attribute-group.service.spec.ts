import { TestBed } from '@angular/core/testing';

import { AttributeGroupService } from './attribute-group.service';

describe('AttributeGroupService', () => {
  let service: AttributeGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
