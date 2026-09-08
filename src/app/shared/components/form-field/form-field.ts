import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="mb-4">
      @if (label) {
        <label [for]="for" class="block mb-2 font-medium">
          {{ label }} @if (required) { <span class="text-red-500">*</span> }
        </label>
      }

      <ng-content></ng-content>

      @if (error) {
        <small class="block mt-1 text-red-500">{{ error }}</small>
      } @else if (hint) {
        <small class="block mt-1 text-surface-500">{{ hint }}</small>
      }
    </div>
  `,
})
export class FormFieldComponent {
  @Input() for = '';
  @Input() label = '';
  @Input() required = false;
  @Input() error: string | null = null;
  @Input() hint?: string;
}