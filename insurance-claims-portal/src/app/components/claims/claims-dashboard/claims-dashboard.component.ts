import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-claims-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 24px;">
      <h2>Welcome to Claims Dashboard</h2>
      <p>Hi, {{ (auth.user$ | async)?.name || 'User' }} 👋</p>
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class ClaimsDashboardComponent {
  constructor(public auth: AuthService) {}
  logout() {
    this.auth.logout();
  }
}
