import { TestBed } from '@angular/core/testing';

import { ShippngMethodService } from './shippng-method.service';

describe('ShippngMethodService', () => {
  let service: ShippngMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippngMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
