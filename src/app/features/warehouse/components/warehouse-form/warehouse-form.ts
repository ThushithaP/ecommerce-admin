import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Branches } from '@features/branch/dto';
import { BranchService } from '@features/branch/service/branch.service';
import { WarehouseFormValues, Warehouses } from '@features/warehouse/dto';
import { BaseModalFormComponent } from '@shared/base/form/base-modal-form.component';
import { FormFieldComponent } from "@shared/components/form-field/form-field";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { Select } from "primeng/select";

@Component({
  selector: 'app-warehouse-form',
  imports: [ReactiveFormsModule, FormFieldComponent, Button, InputText, Select],
  templateUrl: './warehouse-form.html',
  styleUrl: './warehouse-form.css',
})
export class WarehouseForm extends BaseModalFormComponent<Warehouses, WarehouseFormValues> implements OnInit {
  private branchService = inject(BranchService);
  
  readonly branches = signal<Branches[]>([]);
  readonly form = this.fb.nonNullable.group({
    branch: [null,],
    name: ['', [Validators.required, Validators.minLength(3)]],
    docName: ['', [Validators.required]],
    code: ['',],
    address: ['',],
    phone: ['',],
    email: ['', [Validators.email]],
  })

  override get f() {
    return this.form.controls;
  }

  protected override emptyValues(): WarehouseFormValues {
    return { name: '',branch:null, docName: '', code: '', phone: '', email: '' }
  }
  protected override recordToValues(record: Warehouses): WarehouseFormValues {
    return { name: record.name,branch:record.branch, docName: record.docName, code: record.code, phone: record.phone, email: record.email }
  }

  fetchBranches() {
    this.branchService.list({ page: 0, pageSize: 100, search: '', ordering: 'name'}).subscribe({
      next:((res)=>this.branches.set(res.results)),
    })
  }
  
  ngOnInit(): void {
    this.fetchBranches();
  }

}
