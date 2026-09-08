import { HttpErrorResponse } from "@angular/common/http";
import { FormMode } from "@shared/types";
import { Observable, throwError } from "rxjs";

export function getFormTitle(mode: FormMode, resource: string): string {
  const action = {
    create: 'Add',
    edit: 'Edit',
    view: 'View',
  }[mode];

  return `${action} ${resource}`;
}

export function handleError(err: HttpErrorResponse): Observable<never> {
  // Centralized normalization — components branch on status, not on message strings
  const normalized = {
    status: err.status,
    message: err.error?.message ?? 'Unexpected error occurred.',
  };
  return throwError(() => normalized);
}


export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatedDate(date: Date | null): string {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function reloadPage() {
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}