import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Roles } from '@features/rbac/role/dto';
import { RoleService } from '@features/rbac/role/service/role.service';
import { InputText } from "primeng/inputtext";
import { Select } from "primeng/select";
import { DatePicker } from "primeng/datepicker";
import { CreateStaffDto, OptionStatus, StaffFormValues, Staffs } from '@features/staff/dto';
import { ToggleSwitch } from "primeng/toggleswitch";
import { TextareaModule } from 'primeng/textarea';
import { FormMode } from '@shared/types';
import { Button } from "primeng/button";
import { formatedDate } from '@shared/utills';
import { staffFormValueToCreateDto, staffToFormValue } from '@features/staff/staff-form.mapper';

@Component({
  selector: 'app-staff-form',
  imports: [ReactiveFormsModule, InputText, Select, DatePicker, ToggleSwitch, TextareaModule, Button],
  templateUrl: './staff-form.html',
  styleUrl: './staff-form.css',
})
export class StaffForm {
  private readonly roleService = inject(RoleService);
  private readonly fb = inject(FormBuilder);

  cancel = output<void>();
  save = output<CreateStaffDto>();

  mode = input<FormMode>('create');
  record = input<Staffs | null>(null)

  readonly roles = signal<Roles[]>([]);
  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    emp_no: ['', [Validators.required]],
    address: ['', [Validators.required]],
    email: ['', [Validators.email,Validators.required]],
    phone: ['', [Validators.required]],
    dob: [null as Date | null, [Validators.required]],
    gender: ['', [Validators.required]],
    date_joined: [null as Date | null, [Validators.required]],
    is_system_user: [false, [Validators.required]],
    employment_status: ['', [Validators.required]],
    is_active: [true, [Validators.required]],
    role: ['', [Validators.required]],
  });

  readonly status: OptionStatus[] = [
    { value: 'A', name: 'Active' },
    { value: 'OL', name: 'On Leave' },
    { value: 'R', name: 'Resigned' },
  ];
  readonly genders: OptionStatus[] = [
    { value: 'M', name: 'Male' },
    { value: 'F', name: 'Female' },
    { value: 'O', name: 'Other' },
    { value: 'N', name: 'Prefer not to say' },
  ];
  get f() {
    return this.form.controls;
  }

  constructor() {
    let lastId: string | null | undefined = undefined;  

    effect(() => {
      const record = this.record();
      const currentId = record?.id ?? null;

      if (currentId !== lastId) {
        lastId = currentId;
        this.form.reset(record ? staffToFormValue(record) : undefined);
        this.submitting.set(false);
        this.serverError.set(null);
      }
    });

    effect(() => {
      const mode = this.mode();
      mode === 'view' ? this.form.disable() : this.form.enable();
    });
  }

  fetchRoles() {
    this.roleService.list({ search:'', page: 0, pageSize: 20, ordering: '' }).subscribe({
      next: ((res) => {
        this.roles.set(res.results);
      }),
      error: (err) => {
        console.log(err);
      }
    })
  }

  ngOnInit() {
    this.fetchRoles()
  }

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

    const values = this.form.getRawValue() as StaffFormValues;

    const payload = staffFormValueToCreateDto(values);
    this.save.emit(payload);
  }
}

