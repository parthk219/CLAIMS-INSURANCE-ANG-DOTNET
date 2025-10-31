import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryDetailsComponent } from '../form-stages/primary-details/primary-details.component';
import { DocumentsComponent } from '../form-stages/documents/documents.component';
import { ReviewSubmitComponent } from '../form-stages/review-submit/review-submit.component';
import { ClaimService } from '../../../services/claims.service';

@Component({
  selector: 'app-multi-stage-form',
  standalone: true,
  imports: [CommonModule, PrimaryDetailsComponent, DocumentsComponent, ReviewSubmitComponent],
  templateUrl: './multi-stage-form.component.html',
  styleUrls: ['./multi-stage-form.component.css']
})
export class MultiStageFormComponent {
  @Output() formSubmitted = new EventEmitter<void>();

  currentStage = 1;
  primaryData: any = {};
  documentsData: any = {};

  constructor(private claimsService: ClaimService) {}

  handleNext(data: any) {
    if (this.currentStage === 1) this.primaryData = data;
    if (this.currentStage === 2) this.documentsData = data;
    this.currentStage++;
  }

  handleBack() {
    this.currentStage--;
  }

  handleSubmit() {
    const claimData = {
      primaryDetails: this.primaryData,
      documents: this.documentsData
    };

    // ✅ Send data to backend API
    this.claimsService.submitClaim(claimData).subscribe({
      next: (res) => {
        alert('✅ 1 Claim submitted successfully!');
        this.formSubmitted.emit();
        this.currentStage = 1; // Reset form
      },
      error: (err) => {
        console.error('Error submitting claim:', err);
        alert('❌ Failed to submit claim');
      }
    });
  }
}
