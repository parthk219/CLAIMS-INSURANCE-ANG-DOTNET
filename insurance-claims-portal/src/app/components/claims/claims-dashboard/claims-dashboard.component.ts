import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MultiStageFormComponent } from '../multi-stage-form/multi-stage-form.component';
import { ClaimService } from '../../../services/claims.service';
@Component({
  selector: 'app-claims-dashboard',
  standalone: true,
  imports: [CommonModule, MultiStageFormComponent],
  templateUrl: './claims-dashboard.component.html',
  styleUrls: ['./claims-dashboard.component.css']
})
export class ClaimsDashboardComponent implements OnInit {
  user: any;
  claimsCount = 0;
  recentClaims: any[] = [];
  loading = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private claimService: ClaimService
  ) {
    this.user = this.auth.getCurrentUser();
  }

  ngOnInit() {
    this.loadClaimsSummary();
  }

  loadClaimsSummary() {
    this.loading = true;
    this.claimService.getClaimsSummary().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.claimsCount = res.claimsSubmitted || 0;
          this.recentClaims = res.recentClaims || [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching summary:', err);
        this.loading = false;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onClaimSubmitted() {
    this.loadClaimsSummary(); // ✅ Refresh data from backend after new claim submission
  }
}
