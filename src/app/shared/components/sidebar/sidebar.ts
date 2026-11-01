import { Component, computed, inject, input, Input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
    SIDEBAR_SECTIONS,
    SidebarSection,
} from './sidebar.config';

// import { PermissionService } from '../../core/services/permission.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
    ],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    // private readonly permissionService = inject(PermissionService);
    sidebarCollapsed = input<boolean>(false)

    readonly sections = computed<SidebarSection[]>(() =>
        SIDEBAR_SECTIONS
            .map(section => ({
                ...section,
                items: section.items.filter(item =>
                    !item.requiredPermission
                    // ||
                    // this.permissionService.hasPermission(
                    //     item.requiredPermission
                    // )
                ),
            }))
            .filter(section => section.items.length > 0)
    );

    // toggleSidebar(): void {
    //     this.sidebarCollapsed.update(collapsed => !collapsed);
    // }
}