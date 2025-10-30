import { Injectable, signal } from '@angular/core';
import { ClaimFormData } from '../models/form-data.model';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formData = signal<ClaimFormData>({
    primaryDetails: { name: '', policyNumber: '', dateOfIncident: '' },
    incidentDetails: { description: '', location: '', typeOfIncident: '' },
    documents: { files: [], descriptions: [] }
  });

  updatePrimaryDetails(data: Partial<ClaimFormData['primaryDetails']>): void {
    this.formData.update(current => ({
      ...current,
      primaryDetails: { ...current.primaryDetails, ...data }
    }));
  }

  updateIncidentDetails(data: Partial<ClaimFormData['incidentDetails']>): void {
    this.formData.update(current => ({
      ...current,
      incidentDetails: { ...current.incidentDetails, ...data }
    }));
  }

  updateDocuments(data: Partial<ClaimFormData['documents']>): void {
    this.formData.update(current => ({
      ...current,
      documents: { ...current.documents, ...data }
    }));
  }

  getFormData(): ClaimFormData {
    return this.formData();
  }

  clearFormData(): void {
    this.formData.set({
      primaryDetails: { name: '', policyNumber: '', dateOfIncident: '' },
      incidentDetails: { description: '', location: '', typeOfIncident: '' },
      documents: { files: [], descriptions: [] }
    });
  }
}