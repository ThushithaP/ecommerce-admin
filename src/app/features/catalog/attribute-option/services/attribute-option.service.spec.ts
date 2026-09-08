import { TestBed } from '@angular/core/testing';

import { AttributeOptionService } from './attribute-option.service';

describe('AttributeOptionService', () => {
  let service: AttributeOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
