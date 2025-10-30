import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {
  @Input() data: any = {};
  @Output() next = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  form!: FormGroup; // 👈 declare first, initialize later

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // ✅ initialize here (after fb is available)
    this.form = this.fb.group({
      incidentDetails: ['', Validators.required],
      documents: [null, Validators.required]
    });

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  handleFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.form.patchValue({ documents: file });
    }
  }

  submit() {
    if (this.form.valid) {
      this.next.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBack() {
    this.back.emit();
  }

  get incidentDetails() {
    return this.form.get('incidentDetails');
  }
}
