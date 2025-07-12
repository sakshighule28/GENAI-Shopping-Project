using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("order_items")]
    public class OrderItem
    {
        [Column("id")]
        public long Id { get; set; }
        
        [Column("order_id")]
        [Required]
        public long OrderId { get; set; }
        
        [Column("product_id")]
        [Required]
        public long ProductId { get; set; }
        
        [Column("quantity")]
        public int Quantity { get; set; }
        
        [Column("size")]
        public string? Size { get; set; }
        
        [Column("price")]
        public decimal Price { get; set; }
        
        [Column("discount_percent")]
        public int? DiscountPercent { get; set; }
        
        [Column("product_name")]
        public string? ProductName { get; set; }
        
        [Column("total_cost")]
        public decimal TotalCost { get; set; }
    }
}