import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // const token = authService.getAccessToken();
  
  let router = inject(Router);

  // const authReq =  req
  // const authReq = token
  //   ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  //   : req;

  let authReq = req.clone({
    withCredentials: true,
  });
  
  // if (token) {
  //   authReq = authReq.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/auth/refresh')) {
        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const retryReq = req.clone({
              withCredentials: true,
              setHeaders: { Authorization: `Bearer ${authService.getAccessToken()}` },
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            router.navigate(['/signin']);
            return throwError(() => refreshErr)
          })
        );
      }
      return throwError(() => err);
    })
  );
};