import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-primary-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './primary-details.component.html',
  styleUrls: ['./primary-details.component.css']
})
export class PrimaryDetailsComponent {
  @Input() data: any = {};
  @Output() next = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      policyNumber: ['', Validators.required],
      dateOfIncident: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  submit() {
    if (this.form.valid) {
      this.next.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  get name() { return this.form.get('name'); }
  get policyNumber() { return this.form.get('policyNumber'); }
  get dateOfIncident() { return this.form.get('dateOfIncident'); }
}
