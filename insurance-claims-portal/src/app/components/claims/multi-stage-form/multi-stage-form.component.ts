import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryDetailsComponent } from '../form-stages/primary-details/primary-details.component';

@Component({
  selector: 'app-multi-stage-form',
  standalone: true,
  imports: [CommonModule, PrimaryDetailsComponent],
  templateUrl: './multi-stage-form.component.html',
  styleUrls: ['./multi-stage-form.component.css']
})
export class MultiStageFormComponent {
  stage = 1;
  primaryData: any = {};

  handleNext(data: any) {
    this.primaryData = data;
    this.stage++;
  }
}
