import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { ToggleSwitch } from "primeng/toggleswitch";
import { AttributeDefinitionFormValues, AttributeDefinitionPayload, AttributeDefinitions } from '../../dto';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { UnitService } from '@features/units/services/unit.service';
import { Units } from '@features/units/dto';
import { AttributeGroupService } from '@features/catalog/attribute-group/services/attribute-group.service';
import { AttributeGroups } from '@features/catalog/attribute-group/dto';
import { SelectOption } from '@shared/interfaces';
import { DatePicker } from "primeng/datepicker";
import { PanelModule } from "primeng/panel";
import { FormFieldComponent } from '@shared/components/form-field/form-field';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-attribute-definition-form',
  imports: [ToggleSwitch, ReactiveFormsModule, Button, InputText, Select, DatePicker, PanelModule, FormFieldComponent],
  templateUrl: './attribute-definition-form.html',
  styleUrl: './attribute-definition-form.css',
})
export class AttributeDefinitionForm extends BaseModalFormComponent<AttributeDefinitions, AttributeDefinitionFormValues, AttributeDefinitionPayload> implements OnInit {
  private readonly unitService = inject(UnitService);
  private readonly attributeGroupService = inject(AttributeGroupService);
  readonly units = signal<Units[]>([]);
  readonly attributeGroups = signal<AttributeGroups[]>([]);

  fetchUnits() {
    this.unitService.list({
      page: 0,
      pageSize: 100,
      search: '',
      ordering: 'name',
      filters: {},
    }).subscribe({
      next: ((res) => {
        this.units.set(res.results);
      }),
      error: ((err) => {
        console.log(err);
      })
    })
  }

  fetchAttributeGroups() {
    this.attributeGroupService.list({
      page: 0,
      pageSize: 100,
      search: '',
      ordering: 'name',
      filters: {},
    }).subscribe({
      next: ((res) => {
        this.attributeGroups.set(res.results);
      }),
      error: ((err) => {
        console.log(err);
      })
    })
  }

  ngOnInit(): void {
    this.fetchAttributeGroups();
    this.fetchUnits();
  }

  readonly form = this.fb.nonNullable.group(
    {
      label: ['', [Validators.required]],
      code: ['', [Validators.required]],
      defaultValue: [''],
      group: [null as number | null],
      attributeType: ['', [Validators.required]],
      dataType: ['', [Validators.required]],
      filterable: [false],
      required: [false],
      unit: [null as number | null],
      sortOrder: [0],
      // Validation rules
      minLength: [null as number | null, [Validators.min(0)]],
      maxLength: [null as number | null, [Validators.min(0)]],
      pattern: [''],
      min: [null as number | null],
      max: [null as number | null],
      step: [null as number | null, [Validators.min(0)]],
      minDate: [null as Date | null],
      maxDate: [null as Date | null],
      minSelections: [null as number | null, [Validators.min(0)]],
      maxSelections: [null as number | null, [Validators.min(0)]],
    },
  );

  readonly dataType = toSignal(
    this.form.controls.dataType.valueChanges,
    { initialValue: this.form.controls.dataType.value }
  );
  // Computed visibility helpers — drive template @if blocks
  readonly showUnit = computed(() => {
    return this.dataType() === 'number';
  });

  readonly showDefaultValueText = computed(() => {
    return this.dataType() === 'text' || this.dataType() === 'number';
  });

  readonly showDefaultValueToggle = computed(() => this.dataType() === 'boolean');

  readonly showDefaultValueDate = computed(() => this.dataType() === 'date');


  // constructor() {
  //   super();
  //   effect(() => {
  //     const mode = this.mode();
  //     // subclass-specific validator swapping here, same pattern as your example
  //   });
  // }
  override get f() {
    return this.form.controls;
  }

  protected emptyValues(): AttributeDefinitionFormValues {
    return {
      label: '', filterable: false, group: null, attributeType: '', dataType: '',
      required: false, code: '', unit: null, sortOrder: 0, defaultValue: '',
      minLength: null, maxLength: null, min: null, max: null,
      minDate: null, maxDate: null, minSelections: null, maxSelections: null, pattern: '', step: null,
    };
  }

  protected recordToValues(record: AttributeDefinitions): AttributeDefinitionFormValues {
    const rules = record.validationRules ?? {};
    return {
      label: record.label, filterable: record.filterable, group: record.group, attributeType: record.attributeType,
      dataType: record.dataType, required: record.required, code: record.code, unit: record.unit, sortOrder: record.sortOrder,
      defaultValue: record.defaultValue,
      minLength: rules.min_length ?? null,
      maxLength: rules.max_length ?? null,

      min: rules.min ?? null,
      max: rules.max ?? null,
      minDate: rules.min_date ? new Date(rules.min_date) : null,
      maxDate: rules.max_date ? new Date(rules.max_date) : null,
      minSelections: rules.min_selections ?? null,
      maxSelections: rules.max_selections ?? null,
      pattern: rules.pattern ?? '',
      step: rules.step ?? null,
    };
  }

  readonly dataTypes: SelectOption[] = [
    { value: 'text', name: 'Text' },
    { value: 'number', name: 'Number' },
    { value: 'boolean', name: 'Boolean' },
    { value: 'select', name: 'Select' },
    { value: 'multiselect', name: 'Multi Select' },
    { value: 'date', name: 'Date' },
  ];

  readonly attributeTypes: SelectOption[] = [
    { value: 'variant', name: 'Variant' },
    { value: 'specification', name: 'Specification' },
  ];

  protected override toPayload(raw: AttributeDefinitionFormValues): AttributeDefinitionPayload {
    return {
      label: raw.label,
      code: raw.code,
      group: raw.group,
      attributeType: raw.attributeType,
      dataType: raw.dataType,
      unit: raw.unit,
      defaultValue: raw.defaultValue,
      filterable: raw.filterable,
      required: raw.required,
      sortOrder: raw.sortOrder,
      validationRules: this.buildValidationRules(raw),
    };
  }

  private buildValidationRules(raw: AttributeDefinitionFormValues): Record<string, any> {
    const rules: Record<string, any> = {};

    switch (raw.dataType) {
      case 'text':
        if (raw.minLength != null) rules['min_length'] = raw.minLength;
        if (raw.maxLength != null) rules['max_length'] = raw.maxLength;
        if (raw.pattern) rules['pattern'] = raw.pattern;
        break;
      case 'number':
        if (raw.min != null) rules['min'] = raw.min;
        if (raw.max != null) rules['max'] = raw.max;
        if (raw.step != null) rules['step'] = raw.step;
        break;
      case 'date':
        if (raw.minDate) rules['min_date'] = raw.minDate.toISOString().slice(0, 10);
        if (raw.maxDate) rules['max_date'] = raw.maxDate.toISOString().slice(0, 10);
        break;
      case 'select':
      case 'multiselect':
        if (raw.minSelections != null) rules['min_selections'] = raw.minSelections;
        if (raw.maxSelections != null) rules['max_selections'] = raw.maxSelections;
        break;
    }

    return rules;
  }

}
