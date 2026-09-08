import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  success(detail: string, summary = 'Success'): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
    });
  }

  info(detail: string, summary = 'Info'): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
    });
  }

  warn(detail: string, summary = 'Warning'): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
    });
  }

  error(detail: string, summary = 'Error'): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
    });
  }
}
