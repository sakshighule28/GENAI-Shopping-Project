using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingStore.Models
{
    [Table("orders")]
    public class Order
    {
        [Column("id")]
        public long Id { get; set; }
        
        [Column("user_id")]
        [Required]
        public long UserId { get; set; }
        
        [Column("order_date")]
        public DateTime OrderDate { get; set; }
        
        [Column("total_amount")]
        public decimal TotalAmount { get; set; }
        
        [Column("status")]
        public string Status { get; set; } = "PLACED";
        
        [Column("shipping_address")]
        public string? ShippingAddress { get; set; }
        
        [Column("city")]
        public string? City { get; set; }
        
        [Column("state")]
        public string? State { get; set; }
        
        [Column("pincode")]
        public string? Pincode { get; set; }
        
        [Column("phone")]
        public string? Phone { get; set; }
        
        [Column("payment_status")]
        public string? PaymentStatus { get; set; }
        
        [Column("total_items")]
        public int TotalItems { get; set; }
        
        [Column("order_id")]
        public string OrderId { get; set; } = string.Empty;
        
        [Column("delivery_date")]
        public DateTime? DeliveryDate { get; set; }
        
        [Column("status_reason")]
        public string? StatusReason { get; set; }
        
        [Column("cancel_date")]
        public DateTime? CancelDate { get; set; }
        
        [Column("coupon_code")]
        public string? CouponCode { get; set; }
        
        [Column("discount_amount")]
        public decimal? DiscountAmount { get; set; }
        
        [Column("message")]
        public string? Message { get; set; }
        
        [Column("payment_type")]
        public string? PaymentType { get; set; }
    }
}