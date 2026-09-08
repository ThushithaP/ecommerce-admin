import { Component } from '@angular/core';
import { Navbar } from "../../../shared/components/navbar/navbar";
import { Sidebar } from "../../../shared/components/sidebar/sidebar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, Sidebar, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  sidebarCollapsed : boolean = false;
  
  toggleSidebar():void {
    this.sidebarCollapsed = !this.sidebarCollapsed
  }
}
