export interface ClaimFormData {
  primaryDetails: {
    name: string;
    policyNumber: string;
    dateOfIncident: string;
  };
  incidentDetails: {
    description: string;
    location: string;
    typeOfIncident: string;
  };
  documents: {
    files: string[];
    descriptions: string[];
  };
}