using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        
        [Required]
        [Column("username")]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [Column("password")]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        [Column("email")]
        public string Email { get; set; } = string.Empty;
        
        [Column("role")]
        public string Role { get; set; } = "CUSTOMER";
        
        [Column("address")]
        public string? Address { get; set; }
        
        [Column("city")]
        public string? City { get; set; }
        
        [Column("state")]
        public string? State { get; set; }
        
        [Column("pincode")]
        public string? Pincode { get; set; }
        
        [Column("phone")]
        public string? Phone { get; set; }
    }
}