import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Button } from "primeng/button";
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '@core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-navbar',
  imports: [Button, AvatarModule, MenuModule, CommonModule, InputText],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar  {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  readonly currentUser = this.authService.currentUser;
  @Output()
  toggleSidebar = new EventEmitter<void>();
  
  // ngOnInit(): void {
  //   console.log(this.currentUser());
    
  // }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
  
  openProfile() {
    this.router.navigate(['/admin/profile']);
  }

  openSettings() {
    this.router.navigate(['/admin/settings']);
  }

  changePassword() {
    this.router.navigate(['/admin/change-password']);
  }

  logout() {
    this.authService.logout().subscribe({
      next:() => (this.router.navigate(['/signin'])),
      error:() => (this.router.navigate(['/signin']))
    });
    // Clear token
    // Navigate to signin
  }

  userMenuItems: MenuItem[] = [
    {
      label: 'My Account',
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-user',
          command: () => this.openProfile()
        },
        {
          label: 'My Settings',
          icon: 'pi pi-cog',
          command: () => this.openSettings()
        },
        {
          label: 'Change Password',
          icon: 'pi pi-lock',
          command: () => this.changePassword()
        },
        {
          separator: true
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        }
      ]
    },
  ];
}
