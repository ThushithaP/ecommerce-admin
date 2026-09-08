import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Brands, BrandFormValues } from '../../dto';
import { FormMode } from '@shared/types';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { ImageUploader } from "@shared/components/image-uploader/image-uploader";
import { MediaAsset } from '@shared/services/media/media.service';
@Component({
  selector: 'app-brand-form',
  imports: [ReactiveFormsModule, Button, InputText, ImageUploader],
  templateUrl: './brand-form.html',
  styleUrl: './brand-form.css',
})
export class BrandForm {
  cancel = output<void>();
  save = output<BrandFormValues>();

  mode = input<FormMode>('create');
  record = input<Brands | null>(null)

  private readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      slug: [''],
      description: [''],
      logo_id: [null as string | null],
    },
  );

  constructor() {
    effect(() => {
      const record = this.record();
      const mode = this.mode();

      this.submitting.set(false);
      this.serverError.set(null);

      if (record) {
        this.form.reset({
          name: record.name,
          slug: record.slug,
          description: record.description,
          // logo_id: record.logo_id?.id ?? null,
          logo_id: record.logo?.id ?? null,
        })
      } else {
        this.form.reset({
          name: '',
          slug: '',
          description: '',
          logo_id: null,
        });
      }
      mode === 'view' ? this.form.disable() : this.form.enable();
    })
  }

  get f() {
    return this.form.controls;
  }

  onLogoChange(ids: string[]): void {
    this.form.patchValue({ logo_id: ids[0] ?? null });
  }

  // readonly initialLogoAssets = computed<MediaAsset[] | null>(() => {
  //   const logo_id = this.record()?.logo_id;
  //   return logo_id ? [logo_id] : null;
  //   const logo = this.record()?.logo;
  //   return logo ? [logo] : null;
  // });

  readonly initialLogoAssets = computed<MediaAsset[] | null>(() => {
    const logo = this.record()?.logo;
    return logo ? [logo] : null;
  });

  onSubmit(): void {
    if (this.mode() === 'view') {
      return
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.serverError.set(null);
    this.submitting.set(true);

    const values = this.form.getRawValue() as BrandFormValues;
    this.save.emit(values);
  }

  onCancel(): void {
    this.serverError.set(null);
    this.submitting.set(false);
    this.form.reset({
      name: '',
      slug: '',
      description: '',
      logo_id: null,
    });
    this.cancel.emit()
  }
}
