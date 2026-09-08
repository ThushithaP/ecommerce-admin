import { TestBed } from '@angular/core/testing';

import { CategoryAttributeService } from './category-attribute.service';

describe('CategoryAttributeService', () => {
  let service: CategoryAttributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryAttributeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
