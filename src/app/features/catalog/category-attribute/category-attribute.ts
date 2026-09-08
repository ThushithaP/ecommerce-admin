// import { Component, inject, signal } from '@angular/core';
// import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CategoryAttributeFormValues, CategoryAttributeItem } from './dto';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { AttributeDefinitionService } from '../attribute-definition/services/attribute-definition.service';
// import { AttributeDefinitions } from '../attribute-definition/dto';
// import { FormFieldComponent } from "@shared/components/form-field/form-field";
// import { getFieldError } from '@shared/utills/form-errors';
// import { Select } from "primeng/select";
// import { ToastService } from '@shared/services/toast/toast.service';

// type CategoryAttributeOptionGroup = FormGroup<{
//   attribute: import('@angular/forms').FormControl<number | null>;
//   sortOrder: import('@angular/forms').FormControl<number>;
//   required: import('@angular/forms').FormControl<boolean>;
// }>;


// @Component({
//   selector: 'app-category-attribute',
//   imports: [ReactiveFormsModule, ButtonModule, InputTextModule, FormFieldComponent, Select],
//   templateUrl: './category-attribute.html',
//   styleUrl: './category-attribute.css',
// })
// export class CategoryAttribute {
//   private readonly attributeDefinitionService = inject(AttributeDefinitionService);
//    private readonly toast = inject(ToastService);
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);

//   readonly submitting = signal(false);
//   readonly serverError = signal<string | null>(null);

//   categoryId = Number(this.route.snapshot.paramMap.get('id'));
//   categoryName = this.route.snapshot.queryParamMap.get('name');

//   readonly attributedefinitions = signal<AttributeDefinitions[]>([]);

//   protected readonly fb = inject(FormBuilder);
//   readonly form = this.fb.nonNullable.group({
//     category: [null as number | null, [Validators.required]],
//     options: this.fb.array<FormControl<CategoryAttributeOptionGroup>>([]),
//   });

//   get optionsArray(): FormArray<CategoryAttributeOptionGroup> {
//     return this.form.controls.options;
//   }

//   getError(control: AbstractControl) {
//     return getFieldError(control);
//   }

//   private createOption(item?: Partial<CategoryAttributeItem>) {
//     return this.fb.nonNullable.group({
//       attribute: [
//         item?.attribute ?? null,
//         Validators.required
//       ],
//       sortOrder: [
//         item?.sortOrder ?? 0
//       ],
//       required: [
//         item?.required ?? false
//       ],
//     });
//   }

//   addOption(): void {
//     this.optionsArray.push(
//       this.createOption({
//         sortOrder: this.optionsArray.length
//       })
//     );
//   }

//   removeOption(index: number): void {
//     this.optionsArray.removeAt(index);
//     this.reindexSortOrder();
//   }

//   moveUp(index: number): void {
//     if (index === 0) return;
//     this.swap(index, index - 1);
//   }

//   moveDown(index: number): void {
//     if (index === this.optionsArray.length - 1) return;
//     this.swap(index, index + 1);
//   }

//   private swap(a: number, b: number): void {
//     const controls = this.optionsArray.controls;
//     const temp = controls[a].value;
//     controls[a].setValue(controls[b].value);
//     controls[b].setValue(temp);
//     this.reindexSortOrder();
//   }

//   private reindexSortOrder(): void {
//     this.optionsArray.controls.forEach((control, i) => {
//       control.setValue({ ...control.value, sortOrder: i, });
//     });
//   }

//   updateOptionValue(index: number, value: string): void {
//     const current = this.optionsArray.at(index).value;
//     this.optionsArray.at(index).setValue({ ...current, value });
//   }

//   fetchAttributeDefinition() {
//     this.attributeDefinitionService.list({
//       page: 0,
//       pageSize: 100,
//       search: '',
//       ordering: 'name',
//       filters: {},
//     }).subscribe({
//       next: ((res) => {
//         this.attributedefinitions.set(res.results);
//       })
//     })
//   }

//   onSubmit(): void {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     this.serverError.set(null);
//     this.submitting.set(true);

//     const raw = this.form.getRawValue() as CategoryAttributeFormValues;

//     //submit logic
//   }

//   onClose(): void {
//     this.serverError.set(null);
//     this.submitting.set(false);
//     this.router.navigate(['/admin/attribute-definition'])
//   }
// }


import { afterNextRender, Component, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryAttributeFormValues, CategoryAttributeItem } from './dto';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AttributeDefinitionService } from '../attribute-definition/services/attribute-definition.service';
import { AttributeDefinitions } from '../attribute-definition/dto';
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { getFieldError } from '@shared/utills/form-errors';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CategoryAttributeService } from './services/category-attribute.service';
import { ToastService } from '@shared/services/toast/toast.service';

type CategoryAttributeOptionGroup = FormGroup<{
  id: import('@angular/forms').FormControl<number | null>;
  attribute: import('@angular/forms').FormControl<number | null>;
  sortOrder: import('@angular/forms').FormControl<number>;
  required: import('@angular/forms').FormControl<boolean>;
}>;

@Component({
  selector: 'app-category-attribute',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, FormFieldComponent, Select, ToggleSwitch],
  templateUrl: './category-attribute.html',
  styleUrl: './category-attribute.css',
})
export class CategoryAttribute implements OnInit {
  private readonly attributeDefinitionService = inject(AttributeDefinitionService);
  private readonly categoryAttributeService = inject(CategoryAttributeService);
  private readonly toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly injector = inject(Injector);

  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly loading = signal(false);
  readonly loadedRows = signal<CategoryAttributeItem[]>([]);

  categoryId = Number(this.route.snapshot.paramMap.get('id'));
  categoryName = this.route.snapshot.queryParamMap.get('name');

  readonly attributedefinitions = signal<AttributeDefinitions[]>([]);

  protected readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    category: [this.categoryId, [Validators.required]],
    options: this.fb.array<CategoryAttributeOptionGroup>([]),
  });

  get optionsArray(): FormArray<CategoryAttributeOptionGroup> {
    return this.form.controls.options;
  }

  getError(control: AbstractControl) {
    return getFieldError(control);
  }

  private createOption(item?: Partial<CategoryAttributeItem>): CategoryAttributeOptionGroup {
    return this.fb.nonNullable.group({
      id: this.fb.control<number | null>(item?.id ?? null),
      attribute: this.fb.control<number | null>(item?.attribute ?? null, Validators.required),
      sortOrder: this.fb.nonNullable.control(item?.sortOrder ?? 0),
      required: this.fb.nonNullable.control(item?.required ?? false),
    });
  }

  addOption(): void {
    this.optionsArray.push(this.createOption({ sortOrder: this.optionsArray.length }));
  }

  removeOption(index: number): void {
    this.optionsArray.removeAt(index);
    this.reindexSortOrder();
  }

  moveUp(index: number): void {
    if (index === 0) return;
    this.swap(index, index - 1);
  }

  moveDown(index: number): void {
    if (index === this.optionsArray.length - 1) return;
    this.swap(index, index + 1);
  }

  private swap(a: number, b: number): void {
    const controls = this.optionsArray.controls;
    const groupA = controls[a];
    const groupB = controls[b];
    this.optionsArray.setControl(a, groupB);
    this.optionsArray.setControl(b, groupA);
    this.reindexSortOrder();
  }

  private reindexSortOrder(): void {
    this.optionsArray.controls.forEach((control, i) => {
      control.controls.sortOrder.setValue(i);
    });
  }

  fetchAttributeDefinition(): void {
    this.attributeDefinitionService.list({
      page: 0,
      pageSize: 100,
      search: '',
      ordering: 'label',
      filters: {},
    }).subscribe({
      next: (res) => this.attributedefinitions.set(res.results),
      error: (err) => console.log(err),
    });
  }

  fetchExistingAssignments(): void {
    this.loading.set(true);
    this.categoryAttributeService.listByCategory(this.categoryId).subscribe({
      next: (rows) => {
        const sorted = rows.sort((a, b) => a.sortOrder - b.sortOrder);
        this.optionsArray.clear();
        sorted.forEach((row) => this.optionsArray.push(this.createOption(row)));
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Failed to load existing attributes.');
        this.loading.set(false);
      },
    });
  }

  // constructor() {
  //   afterNextRender(() => {
  //     this.fetchAttributeDefinition();
  //     this.fetchExistingAssignments();
  //   });
  // }
  ngOnInit(): void {
    this.fetchAttributeDefinition();
    this.fetchExistingAssignments();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.serverError.set(null);
    this.submitting.set(true);

    const raw = this.form.getRawValue() as CategoryAttributeFormValues;

    this.categoryAttributeService.bulkSync({ category: raw.category, options: raw.options }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.success('Attributes saved.');
      },
      error: () => {
        this.submitting.set(false);
        this.toast.error('Failed to save attributes.');
      },
    });
  }

  onClose(): void {
    this.serverError.set(null);
    this.submitting.set(false);
    this.router.navigate(['/admin/category']);
  }
}