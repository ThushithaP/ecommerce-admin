import { TestBed } from '@angular/core/testing';

import { CategoryPathService } from './category-path.service';

describe('CategoryPathService', () => {
  let service: CategoryPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
