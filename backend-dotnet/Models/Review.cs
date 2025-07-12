using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("reviews")]
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        
        [Required]
        [Column("user_id")]
        public long UserId { get; set; }
        
        [Required]
        [Column("product_id")]
        public long ProductId { get; set; }
        
        [Required]
        [Column("rating")]
        public int Rating { get; set; }
        
        [Column("comment")]
        [MaxLength(1000)]
        public string? Comment { get; set; }
        
        [Column("review_date")]
        public DateTime ReviewDate { get; set; } = DateTime.Now;
    }
}