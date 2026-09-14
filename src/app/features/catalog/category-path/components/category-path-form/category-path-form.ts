import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categories } from '@features/catalog/category/dto';
import { CategoryService } from '@features/catalog/category/services/category.service';
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { Card } from "primeng/card";
import { Select, SelectFilterEvent } from "primeng/select";
import { FormMode } from '@shared/types';
import { CategoriesPath, CategoryPathFormValues } from '@features/catalog/category-path/dto';

@Component({
  selector: 'app-category-path-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button, TableModule, Select],
  templateUrl: './category-path-form.html',
  styleUrl: './category-path-form.css',
})
export class CategoryPathForm  {
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  readonly categories = signal<Categories[]>([]);
  readonly selectedCategories = signal<Categories[]>([]);
  selectedCategoryId: number | null = null;

  cancel = output<void>();
  save = output<CategoryPathFormValues>();

  mode = input<FormMode>('create');
  record = input<CategoriesPath | null>(null);

  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly isViewMode = signal(false);   // drives disabling add/remove/move buttons in template

  readonly form = this.fb.nonNullable.group({
    categoryIds: this.fb.nonNullable.control<number[]>([], Validators.required),
  });

  get f() {
    return this.form.controls;
  }

  constructor() {
    let lastId: number | null | undefined = undefined;

    effect(() => {
      const record = this.record();
      const currentId = record?.id ?? null;

      if (currentId !== lastId) {
        lastId = currentId;
        this.submitting.set(false);
        this.serverError.set(null);

        if (record) {

          // Reconstruct selectedCategories from record.items, ordered by position
          const items = [...record.items].sort((a, b) => a.position - b.position);

          const rebuilt: Categories[] = items.map((item) => ({
            id: item.category,
            name: item.categoryName,
            position: item.position,
          } as Categories));

          this.selectedCategories.set(rebuilt);
          this.form.reset({ categoryIds: rebuilt.map((c) => c.id) });
        } else {
          this.selectedCategories.set([]);
          this.form.reset({ categoryIds: [] });
        }
      }
    });

    effect(() => {
      const mode = this.mode();
      this.isViewMode.set(mode === 'view');
      mode === 'view' ? this.form.disable() : this.form.enable();
    });
  }

  onCategoryFilter(event: SelectFilterEvent): void {
    const search = event.filter ?? '';
    this.categoryService.list({ search, page: 0, pageSize: 20, ordering: '' }).subscribe(response =>
      this.categories.set(response.results)
    );
  }

  addCategory(): void {
    if (this.isViewMode() || this.selectedCategoryId == null) return;

    const category = this.categories().find((c) => c.id === this.selectedCategoryId);
    if (!category) return;
    if (this.selectedCategories().some((c) => c.id === category.id)) return;

    this.selectedCategories.update((items) => [...items, category]);
    this.form.patchValue({ categoryIds: this.selectedCategories().map((c) => c.id) });
    this.selectedCategoryId = null;
  }

  remove(index: number): void {
    if (this.isViewMode()) return;
    this.selectedCategories.update((items) => items.filter((_, i) => i !== index));
    this.form.patchValue({ categoryIds: this.selectedCategories().map((c) => c.id) });
  }

  moveUp(index: number): void {
    if (this.isViewMode() || index === 0) return;
    const items = [...this.selectedCategories()];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    this.selectedCategories.set(items);
    this.form.patchValue({ categoryIds: items.map((c) => c.id) });
  }

  moveDown(index: number): void {
    if (this.isViewMode()) return;
    const items = [...this.selectedCategories()];
    if (index === items.length - 1) return;
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    this.selectedCategories.set(items);
    this.form.patchValue({ categoryIds: items.map((c) => c.id) });
  }

  onSubmit(): void {
    if (this.mode() === 'view') return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.serverError.set(null);

    const values: CategoryPathFormValues = {
      categoryIds: this.selectedCategories().map((c) => c.id),
    };

    this.save.emit(values);
  }
}