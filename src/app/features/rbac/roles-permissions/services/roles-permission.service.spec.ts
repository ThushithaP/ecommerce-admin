import { TestBed } from '@angular/core/testing';

import { RolesPermissionService } from './roles-permission.service';

describe('RolesPermissionService', () => {
  let service: RolesPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
