using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClaimsAPI.Models
{
    public class ClaimModel
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string PolicyNumber { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateOfIncident { get; set; }

        [StringLength(1000)]
        public string IncidentDetails { get; set; } = string.Empty;

        [StringLength(255)]
        public string UploadedFileName { get; set; } = string.Empty;

        public DateTime SubmittedDate { get; set; } = DateTime.UtcNow;

        [StringLength(50)]
        public string Status { get; set; } = "Submitted";

        public DateTime? LastUpdated { get; set; } = DateTime.UtcNow;

        [StringLength(500)]
        public string? Remarks { get; set; }

        public int ClaimsCount { get; set; }
    }

    public class SubmitClaimRequest
    {
        public string Name { get; set; } = string.Empty;
        public string PolicyNumber { get; set; } = string.Empty;
        public DateTime DateOfIncident { get; set; }
        public string IncidentDetails { get; set; } = string.Empty;
        public string UploadedFileName { get; set; } = string.Empty;
    }
}