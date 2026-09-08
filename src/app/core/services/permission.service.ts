import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly _permissions = signal<Set<string>>(new Set());
  private readonly _isSuperuser = signal(false);

  readonly permissions = computed(() => this._permissions());

  setPermissions(codes: string[]): void {
    this._isSuperuser.set(codes.includes('*'));
    this._permissions.set(new Set(codes));
  }

  clear(): void {
    this._permissions.set(new Set());
    this._isSuperuser.set(false);
  }

  has(code: string): boolean {
    if (this._isSuperuser()) return true;
    return this._permissions().has(code);
  }

  hasAny(codes: string[]): boolean {
    if (this._isSuperuser()) return true;
    return codes.some((c) => this._permissions().has(c));
  }

  hasAll(codes: string[]): boolean {
    if (this._isSuperuser()) return true;
    return codes.every((c) => this._permissions().has(c));
  }
}