using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("wishlists")]
    public class Wishlist
    {
        [Column("id")]
        public long Id { get; set; }
        
        [Column("user_id")]
        [Required]
        public long UserId { get; set; }
        
        [Column("product_id")]
        [Required]
        public long ProductId { get; set; }
    }
}