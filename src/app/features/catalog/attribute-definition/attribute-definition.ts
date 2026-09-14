import { Component, inject } from '@angular/core';
import { BaseModalCrudPage } from '@shared/base/pages/base-modal-crud-page.component';
import { AttributeDefinitionPayload, AttributeDefinitions } from './dto';
import { AttributeDefinitionService } from './services/attribute-definition.service';
import { TableAction, TableColumn } from '@shared/models/table-column.model';
import { formatDateTime } from '@shared/utills';
import { Dialog } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { DataTable } from "@shared/components/data-table/data-table";
import { AttributeDefinitionForm } from "./components/attribute-definition-form/attribute-definition-form";
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attribute-definition',
  imports: [BreadcrumbModule, Dialog, ButtonModule, IconField, InputIcon, DataTable,InputTextModule, AttributeDefinitionForm],
  templateUrl: './attribute-definition.html',
  styleUrl: './attribute-definition.css',
})
export class AttributeDefinition extends BaseModalCrudPage<AttributeDefinitions, AttributeDefinitionPayload> {
  protected readonly service = inject(AttributeDefinitionService);
  protected readonly entityLabel = 'Attribute Definition';
  private router = inject(Router);

  items: MenuItem[] = [{ icon: 'pi pi-sliders-h', label: this.entityLabel }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

  columns: TableColumn<AttributeDefinitions>[] = [
    { key: 'label', label: 'Label', sortable: true },
    { key: 'updated_at', label: 'Last Modified', type: 'date', formatter: formatDateTime },
  ];

  actions: TableAction<AttributeDefinitions>[] = [
    { label: '', tooltip: 'View', color: 'primary', icon: 'pi pi-eye', handler: (row) => this.view(row) },
    { label: '', tooltip: 'Edit', color: 'warn', icon: 'pi pi-pencil', handler: (row) => this.edit(row) },
    { label: '', tooltip: 'Options', color: 'default', icon: 'pi pi-asterisk', handler: (row) => this.navigateToAttributeOptions(row) },
    { label: '', tooltip: 'Delete', color: 'danger', icon: 'pi pi-trash', handler: (row) => this.delete(row) },
  ];

  onStatusFilterChange(status: string | null): void {
    this.updateFilters({ status });   // merges into filters signal + refetches
  }

  navigateToAttributeOptions(row:AttributeDefinitions) {
    this.router.navigate(
      ['admin/attribute-option', row.id],
      {
        queryParams :{
          name:row.label
        }
      }
    );
  }
}
