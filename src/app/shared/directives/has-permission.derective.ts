// shared/directives/has-permission.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { PermissionService } from '@core/services/permission.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);

  private code: string | string[] = [];
  private mode: 'any' | 'all' = 'any';
  private rendered = false;

  @Input() set appHasPermission(value: string | string[]) {
    this.code = value;
    this.render();
  }

  @Input() set appHasPermissionMode(mode: 'any' | 'all') {
    this.mode = mode;
    this.render();
  }

  constructor() {
    effect(() => {
      this.permissionService.permissions();   // track signal
      this.render();
    });
  }

  private render(): void {
    const codes = Array.isArray(this.code) ? this.code : [this.code];
    const allowed = codes.length === 0
      ? true
      : this.mode === 'all'
        ? this.permissionService.hasAll(codes)
        : this.permissionService.hasAny(codes);

    if (allowed && !this.rendered) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.rendered = true;
    } else if (!allowed && this.rendered) {
      this.viewContainer.clear();
      this.rendered = false;
    }
  }
}