import { Component, computed } from '@angular/core';
import { Brands, BrandFormValues } from '../../dto';
import { AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { ImageUploader } from "@shared/components/image-uploader/image-uploader";
import { MediaAsset } from '@shared/services/media/media.service';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { getFieldError } from '@shared/utills/form-errors';
@Component({
  selector: 'app-brand-form',
  imports: [ReactiveFormsModule, Button, InputText, ImageUploader],
  templateUrl: './brand-form.html',
  styleUrl: './brand-form.css',
})
export class BrandForm extends BaseModalFormComponent<Brands, BrandFormValues> {
  
  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      slug: [''],
      description: [''],
      logoId: [null as string | null],
    },
  );

  override get f() {
    return this.form.controls;
  }

  override getError(control: AbstractControl) {
    return getFieldError(control);
  }

  onLogoChange(ids: string[]): void {
    this.form.patchValue({ logoId: ids[0] ?? null });
  }

  readonly initialLogoAssets = computed<MediaAsset[] | null>(() => {
    const logo = this.record()?.logo;
    return logo ? [logo] : null;
  });

  protected override emptyValues(): BrandFormValues {
    return{ name: '', slug: '', description: '', logoId: '' };
  }

  protected override recordToValues(record: Brands): BrandFormValues {
    return{ name: record.name, slug: record.slug, description: record.slug, logoId:record.logo?.id ?? '' };
  }
}
