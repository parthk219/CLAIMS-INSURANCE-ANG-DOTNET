import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryDetailsComponent } from '../form-stages/primary-details/primary-details.component';
import { DocumentsComponent } from '../form-stages/documents/documents.component';

@Component({
  selector: 'app-multi-stage-form',
  standalone: true,
  imports: [CommonModule, PrimaryDetailsComponent, DocumentsComponent],
  templateUrl: './multi-stage-form.component.html',
  styleUrls: ['./multi-stage-form.component.css']
})
export class MultiStageFormComponent {
  stage = 1;

  primaryData: any = {};
  documentsData: any = {};

  handleNext(data: any) {
    if (this.stage === 1) {
      this.primaryData = data;
      this.stage = 2;
    } else if (this.stage === 2) {
      this.documentsData = data;
      console.log('✅ Final Form Data:', {
        primary: this.primaryData,
        documents: this.documentsData
      });
      alert('Form submitted successfully!');
    }
  }

  handleBack() {
    if (this.stage > 1) {
      this.stage--;
    }
  }
}
