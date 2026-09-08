import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from '@core/auth/auth.service';

import { catchError, firstValueFrom, of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const authService = inject(AuthService);

      return firstValueFrom(
        authService.fetchMe().pipe(
          catchError(() => of(null))
        )
      );
    }),

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),

    MessageService,
  ],
};