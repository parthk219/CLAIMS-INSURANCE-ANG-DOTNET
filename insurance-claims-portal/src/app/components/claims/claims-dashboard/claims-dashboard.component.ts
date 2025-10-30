import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MultiStageFormComponent } from '../multi-stage-form/multi-stage-form.component';

@Component({
  selector: 'app-claims-dashboard',
  standalone: true,
  imports: [CommonModule, MultiStageFormComponent],
  templateUrl: './claims-dashboard.component.html',
  styleUrls: ['./claims-dashboard.component.css']
})
export class ClaimsDashboardComponent {
  user: any;
  claimsCount = 0;

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onClaimSubmitted() {
    this.claimsCount++;
  }
}