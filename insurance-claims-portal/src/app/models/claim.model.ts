export interface Claim {
  id?: number;
  name: string;
  policyNumber: string;
  dateOfIncident: string;
  incidentDetails: string;
  documents: string[];
  status: string;
  submittedDate?: string;
}