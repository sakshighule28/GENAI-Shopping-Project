using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("coupons")]
    public class Coupon
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        
        [Required]
        [Column("code")]
        public string Code { get; set; } = string.Empty;
        
        [Required]
        [Column("discount_percent", TypeName = "decimal(5,2)")]
        public decimal DiscountPercent { get; set; }
        
        [Column("status")]
        public string Status { get; set; } = "ACTIVE";
        
        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}