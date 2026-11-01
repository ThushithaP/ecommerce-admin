import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '@core/services/permission.service';

export const permissionGuard: CanActivateFn = (route) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);
  const required = route.data['permission'] as string | undefined;

  if (!required || permissionService.has(required)) {
    return true;
  }
  router.navigate(['/forbidden']);
  return false;
};