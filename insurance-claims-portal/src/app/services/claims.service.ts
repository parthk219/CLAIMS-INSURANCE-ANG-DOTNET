import { Injectable, signal } from '@angular/core';
import { Claim } from '../models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private claims = signal<Claim[]>([]);

  constructor() {
    // Load claims from localStorage
    const savedClaims = localStorage.getItem('submittedClaims');
    if (savedClaims) {
      this.claims.set(JSON.parse(savedClaims));
    }
  }

  submitClaim(claimData: any): void {
    const newClaim: Claim = {
      id: Date.now(),
      name: claimData.primaryDetails.name,
      policyNumber: claimData.primaryDetails.policyNumber,
      dateOfIncident: claimData.primaryDetails.dateOfIncident,
      incidentDetails: claimData.incidentDetails.description,
      documents: claimData.documents.files,
      status: 'Submitted',
      submittedDate: new Date().toISOString()
    };

    this.claims.update(claims => [...claims, newClaim]);
    localStorage.setItem('submittedClaims', JSON.stringify(this.claims()));
  }

  getSubmittedClaimsCount(): number {
    return this.claims().length;
  }

  getAllClaims(): Claim[] {
    return this.claims();
  }
}