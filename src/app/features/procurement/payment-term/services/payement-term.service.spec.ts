import { TestBed } from '@angular/core/testing';

import { PayementTermService } from './payement-term.service';

describe('PayementTermService', () => {
  let service: PayementTermService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayementTermService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
