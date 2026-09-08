import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categories } from '@features/catalog/category/dto';
import { CategoryService } from '@features/catalog/category/services/category.service';
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { Card } from "primeng/card";
import { Select } from "primeng/select";
import { FormMode } from '@shared/types';
import { CategoriesPath, CategoryPathFormValues } from '@features/catalog/category-path/dto';

@Component({
  selector: 'app-category-path-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button, TableModule, Card, Select],
  templateUrl: './category-path-form.html',
  styleUrl: './category-path-form.css',
})
export class CategoryPathForm implements OnInit {
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
    category_ids: this.fb.nonNullable.control<number[]>([], Validators.required),
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
            name: item.category_name,
          } as Categories));

          this.selectedCategories.set(rebuilt);
          this.form.reset({ category_ids: rebuilt.map((c) => c.id) });
        } else {
          this.selectedCategories.set([]);
          this.form.reset({ category_ids: [] });
        }
      }
    });

    effect(() => {
      const mode = this.mode();
      this.isViewMode.set(mode === 'view');
      mode === 'view' ? this.form.disable() : this.form.enable();
    });
  }

  fetchCategories() {
    this.categoryService.list().subscribe({
      next: (res) => this.categories.set(res.results),
      error: (err) => console.log(err),
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  addCategory(): void {
    if (this.isViewMode() || this.selectedCategoryId == null) return;

    const category = this.categories().find((c) => c.id === this.selectedCategoryId);
    if (!category) return;
    if (this.selectedCategories().some((c) => c.id === category.id)) return;

    this.selectedCategories.update((items) => [...items, category]);
    this.form.patchValue({ category_ids: this.selectedCategories().map((c) => c.id) });
    this.selectedCategoryId = null;
  }

  remove(index: number): void {
    if (this.isViewMode()) return;
    this.selectedCategories.update((items) => items.filter((_, i) => i !== index));
    this.form.patchValue({ category_ids: this.selectedCategories().map((c) => c.id) });
  }

  moveUp(index: number): void {
    if (this.isViewMode() || index === 0) return;
    const items = [...this.selectedCategories()];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    this.selectedCategories.set(items);
    this.form.patchValue({ category_ids: items.map((c) => c.id) });
  }

  moveDown(index: number): void {
    if (this.isViewMode()) return;
    const items = [...this.selectedCategories()];
    if (index === items.length - 1) return;
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    this.selectedCategories.set(items);
    this.form.patchValue({ category_ids: items.map((c) => c.id) });
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
      category_ids: this.selectedCategories().map((c) => c.id),
    };

    this.save.emit(values);
  }
}