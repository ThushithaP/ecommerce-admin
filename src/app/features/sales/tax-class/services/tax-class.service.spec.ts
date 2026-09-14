import { TestBed } from '@angular/core/testing';

import { TaxClassService } from './tax-class.service';

describe('TaxClassService', () => {
  let service: TaxClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
