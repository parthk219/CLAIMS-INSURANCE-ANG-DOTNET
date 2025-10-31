import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

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

  userEmail: string | null = null; // ✅ holds logged-in user's email

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // ✅ Try to get email from AuthService or localStorage
    const user = this.authService.getCurrentUser();
    this.userEmail = user?.email || localStorage.getItem('userEmail');
  }

  goBack() {
    this.back.emit();
  }

  submit() {
    this.submitClaim.emit(); // ✅ let parent handle API call
  }
}
