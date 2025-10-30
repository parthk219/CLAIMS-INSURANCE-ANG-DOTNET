namespace ClaimsAPI.Model
{
    public class ClaimModel
    {
        public string Id { get; set; }

        // From Primary Details
        public string Name { get; set; }
        public string Email { get; set; }
        public string PolicyNumber { get; set; }

        // From Incident Details
        public string Type { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public DateTime DateOfIncident { get; set; }

        // Optional: File names
        //public List<string> Documents { get; set; }

        public string Status { get; set; } = "Pending";
    }
}
