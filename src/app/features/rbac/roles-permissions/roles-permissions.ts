import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TitleCasePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PermissionService } from '../permissions/services/permission.service';
import { PermissionModule } from './dto';
import { RolesPermissionService } from './services/roles-permission.service';

@Component({
  selector: 'app-roles-permissions',
  imports: [
    ReactiveFormsModule,
    CardModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    TitleCasePipe,
  ],
  templateUrl: './roles-permissions.html',
  styleUrl: './roles-permissions.css',
})
export class RolesPermissions implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  readonly permissionService = inject(PermissionService);
  readonly rolePermissionService = inject(RolesPermissionService);

  modules = signal<PermissionModule[]>([]);

  roleId = this.route.snapshot.paramMap.get('id');
  roleName = this.route.snapshot.queryParamMap.get('name');

  form = this.fb.group({
    permissions: this.fb.group({})
  });

  readonly actions = [
    'view',
    'create',
    'update',
    'delete',
    'export',
    'approve',
  ];

  get permissionControls(): FormGroup {
    return this.form.controls.permissions;
  }

  loadPermissions(
    modules: PermissionModule[],
    assignedPermissionIds: string[]
  ): void {

    this.modules.set(modules);

    const assignedIds = new Set(
      assignedPermissionIds
    );

    const controls: Record<
      string,
      FormControl<boolean>
    > = {};

    for (const module of modules) {

      for (const permission of module.permissions) {

        controls[permission.id] =
          this.fb.nonNullable.control(
            assignedIds.has(permission.id)
          );

      }
    }

    this.form.setControl(
      'permissions',
      this.fb.group(controls)
    );
  }

  fetchData(): void {
    if (!this.roleId) {
      return
    }
    forkJoin({
      modules: this.permissionService.listGroupByModule(),
      rolePermissions: this.rolePermissionService.getById(this.roleId),

    }).subscribe({
      next: ({ modules, rolePermissions }) => {
        this.loadPermissions(
          modules,
          rolePermissions.permission_ids
        );
      },
      error: (err) => {
      },
    })
  }

  ngOnInit(): void {
    this.fetchData()
  }

  submit(): void {

    if (this.form.invalid || !this.roleId) {
      return;
    }

    const permissionIds = Object.entries(
      this.permissionControls.getRawValue()
    )
      .filter(([, selected]) => selected)
      .map(([id]) => id);

    const payload = {
      role: this.roleId,
      permissions: permissionIds,
    };

    this.rolePermissionService.save(payload).subscribe({
      next: () => {
        this.fetchData()
      },

      error: (err) => {
        console.error(
          'Failed to save permissions',
          err
        );
      },
    });
  }
}
