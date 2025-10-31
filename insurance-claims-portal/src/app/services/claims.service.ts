import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private baseUrl = 'http://localhost:3001/Claims';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ✅ Submit claim to backend API
  submitClaim(claimData: any): Observable<any> {
    const user = this.authService.getCurrentUser();
    const email = user?.email || localStorage.getItem('userEmail') || '';

    const payload = {
      name: claimData.primaryDetails.name,
      policyNumber: claimData.primaryDetails.policyNumber,
      dateOfIncident: claimData.primaryDetails.dateOfIncident,
      email: email, // ✅ ensure email always goes
      incidentDetails: claimData.documents.incidentDetails,
      documents: claimData.documents.documents?.name || 'N/A'
    };

    console.log('🚀 Submitting payload:', payload);

    return this.http.post(`${this.baseUrl}/submit`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get claim summary for dashboard
  getClaimsSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/summary`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get all claims of logged-in user
  getAllClaims(): Observable<any> {
    return this.http.get(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get claim by ID
  getClaimById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
