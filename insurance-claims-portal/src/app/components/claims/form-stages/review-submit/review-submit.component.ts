import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-submit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-submit.component.html',
  styleUrls: ['./review-submit.component.css']
})
export class ReviewSubmitComponent {
  @Input() primaryData: any;
  @Input() documentsData: any;
  @Output() back = new EventEmitter<void>();
  @Output() submitClaim = new EventEmitter<void>();

  goBack() {
    this.back.emit();
  }

  submit() {
    alert('Claim submitted successfully!');
    this.submitClaim.emit();
  }
}
