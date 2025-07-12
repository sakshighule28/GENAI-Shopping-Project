using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("cart_items")]
    public class CartItem
    {
        [Column("id")]
        public long Id { get; set; }
        
        [Column("user_id")]
        [Required]
        public long UserId { get; set; }
        
        [Column("product_id")]
        [Required]
        public long ProductId { get; set; }
        
        [Column("quantity")]
        public int Quantity { get; set; }
        
        [Column("size")]
        public string? Size { get; set; }
    }
}