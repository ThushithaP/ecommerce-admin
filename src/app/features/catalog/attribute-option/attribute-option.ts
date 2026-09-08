import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { AttributeOptionFormValues, AttributeOptionItem } from './dto';
import { AttributeOptionService } from './services/attribute-option.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AttributeDefinitions } from '../attribute-definition/dto';
import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFieldError } from '@shared/utills/form-errors';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '@shared/services/toast/toast.service';

@Component({
  selector: 'app-attribute-option',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule,],
  templateUrl: './attribute-option.html',
  styleUrl: './attribute-option.css',
})

export class AttributeOption implements OnInit {
  private readonly attributeoptionService = inject(AttributeOptionService);
  private readonly toast = inject(ToastService);
  private router = inject(Router);
  readonly attributeDefinitions = signal<AttributeDefinitions[]>([]);
  private route = inject(ActivatedRoute);

  // record = input<AttributeOptions | null>(null);

  attributeId = Number(this.route.snapshot.paramMap.get('id'));
  attributeName = this.route.snapshot.queryParamMap.get('name');

  protected readonly fb = inject(FormBuilder);
  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);
  protected readonly destroy$ = new Subject<void>();
  readonly form = this.fb.nonNullable.group({
    attribute: [null as number | null, [Validators.required]],
    options: this.fb.array<FormControl<AttributeOptionItem>>([]),
  });

  getError(control: AbstractControl) {
    return getFieldError(control);
  }

  constructor() {
    let lastKey: string | undefined = undefined;
    effect(() => {
      // const record = this.record();
      // const currentId = this.record()?.id
      // const currentKey = `${currentId}`;

      // if (currentKey !== lastKey) {
        // lastKey = currentKey;
        this.submitting.set(false);
        this.serverError.set(null);
        this.resetForm(false);
      // }
    });
  }


  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.serverError.set(null);
    this.submitting.set(true);

    const raw = this.form.getRawValue() as AttributeOptionFormValues;
    const request$ = this.attributeoptionService.bulkSync(raw);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.toast.success(`${this.attributeId ? 'Updated' : 'Created'} successfully.`);
      },
      error: () => {
        this.toast.error(`Failed to ${this.attributeName ? 'update' : 'create'} .`);
      },
    });
    this.onClose();
  }

  onClose(): void {
    this.serverError.set(null);
    this.submitting.set(false);
    this.router.navigate(['/admin/attribute-definition'])
  }

  get optionsArray(): FormArray {
    return this.form.controls.options;
  }

  emptyValues(): AttributeOptionFormValues {
    return { attribute: null, options: [] };
  }

  recordToValues(record: AttributeOptionFormValues): AttributeOptionFormValues {
    return { attribute: record.attribute, options: record.options ?? [] };
  }

  // Rebuild the FormArray whenever the form resets (create/edit/view) — FormBuilder can't
  // auto-size an array from reset() the way it does plain controls, so do it manually.
  resetForm(onCancel: boolean): void {
    // const record = this.record();
    // const values = record && !onCancel
    //   ? this.recordToValues(record)
    //   : this.emptyValues();

    // this.form.controls.attribute.setValue(values.attribute);

    // this.optionsArray.clear();

    // for (const item of values.options) {
    //   this.optionsArray.push(
    //     this.fb.nonNullable.control<AttributeOptionItem>(item)
    //   );
    // }
  }

  addOption(): void {
    const nextSortOrder = this.optionsArray.length;
    this.optionsArray.push(
      this.fb.nonNullable.control<AttributeOptionItem>({ value: '', sortOrder: nextSortOrder })
    );
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
    const temp = controls[a].value;
    controls[a].setValue(controls[b].value);
    controls[b].setValue(temp);
    this.reindexSortOrder();
  }

  private reindexSortOrder(): void {
    this.optionsArray.controls.forEach((control, i) => {
      control.setValue({ ...control.value, sortOrder: i });
    });
  }

  updateOptionValue(index: number, value: string): void {
    const current = this.optionsArray.at(index).value;
    this.optionsArray.at(index).setValue({ ...current, value });
  }

  // fetchAttributeDefinitions(): void {
  //   this.attributeDefinitionService.list({ page: 0, pageSize: 100, search: '', ordering: 'label', filters: {} })
  //     .subscribe({ next: (res) => this.attributeDefinitions.set(res.results) });
  // }

  fetchData(): void {
    if (!this.attributeId) {
      return
    }
    this.attributeoptionService.listByAttribute(this.attributeId).subscribe({
      next: ((res) => {
        this.form.controls.attribute.setValue(this.attributeId);
        this.optionsArray.clear();
        for (const item of res) {
          this.optionsArray.push(
            this.fb.nonNullable.control<AttributeOptionItem>({
              id: item.id,
              value: item.value,
              sortOrder: item.sortOrder,
            })
          );
        }
      })
    })

  }

  ngOnInit(): void {
    this.fetchData()
  }
}