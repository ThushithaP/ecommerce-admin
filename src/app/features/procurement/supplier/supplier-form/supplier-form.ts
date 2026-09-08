import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { SupplierFormValues, Suppliers } from '../dto';
import { FormMode } from '@shared/types';
import { ActivatedRoute, Router } from '@angular/router';
import { PayementTermService } from '@features/procurement/payment-term/services/payement-term.service';
import { PaymentTerms } from '@features/procurement/payment-term/dto';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from "@shared/components/form-field/form-field";
import { getFieldError } from '@shared/utills/form-errors';
import { InputText } from "primeng/inputtext";
import { SelectOption } from '@shared/interfaces';
import { Select } from "primeng/select";
import { Button } from "primeng/button";
import { ToggleSwitch } from "primeng/toggleswitch";
import { SupplierService } from '../services/supplier.service';

type ContactGroup = FormGroup<{
  id: FormControl<number | null>;
  name: FormControl<string>;
  designation: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  isPrimary: FormControl<boolean>;
}>;

@Component({
  selector: 'app-supplier-form',
  imports: [ReactiveFormsModule, FormFieldComponent, InputText, Select, Button, ToggleSwitch],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css',
})
export class SupplierForm implements OnInit {
  save = output<SupplierFormValues>();
  mode = input<FormMode>('create');

  private readonly fb = inject(FormBuilder);

  private readonly paymentTermService = inject(PayementTermService);
  private readonly service = inject(SupplierService);

  private readonly route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly paymentTerms = signal<PaymentTerms[]>([]);
  readonly supplierId = signal<number | null>(null);
  readonly loadedSupplier = signal<Suppliers | null>(null);
  readonly submitting = signal(false);

  readonly types: SelectOption[] = [
    { value: 'company', name: 'Company' },
    { value: 'individual', name: 'Individual' },
  ];

  readonly form = this.fb.nonNullable.group({
    supplierCode: [''],
    supplierType: ['', [Validators.required]],
    companyName: [''],
    firstName: [''],
    lastName: [''],
    taxRegistrationNo: [''],
    registrationNo: ['', [Validators.required]],
    creditLimit: [0, [Validators.required, Validators.min(0)]],
    creditPeriodDays: [0, [Validators.required]],
    paymentTerms: [null as number | null, [Validators.required]],
    email: ['', [Validators.email]],
    phone: [''],
    website: [''],
    currency: ['LKR'],
    notes: ['LKR'],
    contacts: this.fb.array<ContactGroup>([]),
  });

  fetchPaymentTerm(): void {
    this.paymentTermService.list({ page: 0, pageSize: 100, search: '', ordering: 'name', })
      .subscribe({ next: (res) => this.paymentTerms.set(res.results) });
  }

  ngOnInit(): void {
    this.fetchPaymentTerm();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.supplierId.set(Number(idParam));
      this.loadSupplier(idParam);
    }
  }

  get f() {
    return this.form.controls;
  }
  get contactsArray(): FormArray<ContactGroup> {
    return this.form.controls.contacts;
  }

  onCancel(): void {
    this.router.navigate(['admin/procurement/supplier']);
  }

  constructor() {
    effect(() => {
      this.applyDisabledStateToArrays();
    })
  }

  private applyDisabledStateToArrays(): void {
    const shouldDisable = this.mode() === 'view';
    shouldDisable ? this.form.disable() : this.form.enable();
    shouldDisable ? this.contactsArray.disable() : this.contactsArray.enable();
  }

  private createContact(item?: Partial<import('../dto').SupplierContactItem>): ContactGroup {
    return this.fb.group({
      id: this.fb.control<number | null>(item?.id ?? null),
      name: this.fb.nonNullable.control(item?.name ?? '', [Validators.required]),
      designation: this.fb.nonNullable.control(item?.designation ?? ''),
      email: this.fb.nonNullable.control(item?.email ?? '', [Validators.email]),
      phone: this.fb.nonNullable.control(item?.phone ?? ''),
      isPrimary: this.fb.nonNullable.control(item?.isPrimary ?? false),
    }) as ContactGroup;
  }

  addContact(): void {
    const isFirst = this.contactsArray.length === 0;
    this.contactsArray.push(this.createContact({ isPrimary: isFirst }));
  }

  removeContact(index: number): void {
    this.contactsArray.removeAt(index);
  }

  setPrimaryContact(index: number): void {
    this.contactsArray.controls.forEach((c, i) => c.controls.isPrimary.setValue(i === index));
  }

  getError(control: any) {
    return getFieldError(control);
  }

  loadSupplier(id: string): void {
    if (!this.service.getById) {
      return;
    }
    this.service.getById(id).subscribe({
      next: (supplier) => this.populateForm(supplier),
      // error: () => this.toast.error('Failed to load supplier.'),
    });
  }

  private populateForm(supplier: Suppliers): void {
    this.form.patchValue({
      supplierCode: supplier.supplierCode,
      supplierType: supplier.supplierType,
      companyName: supplier.companyName ?? '',
      firstName: supplier.firstName ?? '',
      lastName: supplier.lastName ?? '',
      taxRegistrationNo: supplier.taxRegistrationNo ?? '',
      registrationNo: supplier.registrationNo ?? '',
      email: supplier.email ?? '',
      phone: supplier.phone ?? '',
      website: supplier.website ?? '',
      creditLimit: supplier.creditLimit,
      creditPeriodDays: supplier.creditPeriodDays,
      paymentTerms: supplier.paymentTerms?.id ?? null,
      currency: supplier.currency,
    });

    this.contactsArray.clear();
    supplier.contacts.forEach((c) => this.contactsArray.push(this.createContact(c)));
    this.applyDisabledStateToArrays();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue() as SupplierFormValues;
    this.submitting.set(true);
    this.save.emit(values);
  }
}