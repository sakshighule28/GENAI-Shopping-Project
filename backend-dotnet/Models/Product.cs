using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("products")]
    public class Product
    {
        [Column("id")]
        public long Id { get; set; }
        
        [Column("name")]
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Column("description")]
        public string? Description { get; set; }
        
        [Column("base_price")]
        [Required]
        public decimal BasePrice { get; set; }
        
        [Column("discounted_price")]
        public decimal? DiscountedPrice { get; set; }
        
        [Column("discount_percent")]
        public decimal DiscountPercent { get; set; }
        
        [Column("units_in_stock")]
        [Required]
        public int UnitsInStock { get; set; }
        
        [Column("brand")]
        public string? Brand { get; set; }
        
        [Column("sizes")]
        public string? Sizes { get; set; }
        
        [Column("image_url")]
        public string? ImageUrl { get; set; }
        
        [Column("category_id")]
        [Required]
        public long CategoryId { get; set; }
    }
}