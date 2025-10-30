import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryDetailsComponent } from '../form-stages/primary-details/primary-details.component';
import { DocumentsComponent } from '../form-stages/documents/documents.component';
import { ReviewSubmitComponent } from '../form-stages/review-submit/review-submit.component'; // ✅ Correct import

@Component({
  selector: 'app-multi-stage-form',
  standalone: true,
  imports: [CommonModule, PrimaryDetailsComponent, DocumentsComponent, ReviewSubmitComponent],
  templateUrl: './multi-stage-form.component.html',
  styleUrls: ['./multi-stage-form.component.css']
})
export class MultiStageFormComponent {
  currentStage = 1;
  primaryData: any = {};
  documentsData: any = {};

  handleNext(data: any) {
    if (this.currentStage === 1) this.primaryData = data;
    if (this.currentStage === 2) this.documentsData = data;
    this.currentStage++;
  }

  handleBack() {
    this.currentStage--;
  }

  handleSubmit() {
    alert('✅ Claim submitted successfully!');
  }
}
