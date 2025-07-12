using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("coupon_usage")]
    public class CouponUsage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        
        [Required]
        [Column("user_id")]
        public long UserId { get; set; }
        
        [Required]
        [Column("coupon_id")]
        public long CouponId { get; set; }
        
        [Column("used_date")]
        public DateTime UsedDate { get; set; } = DateTime.Now;
    }
}