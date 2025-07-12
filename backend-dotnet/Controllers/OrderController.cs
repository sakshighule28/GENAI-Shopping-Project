using Microsoft.AspNetCore.Mvc;
using ClothingStore.Data;
using ClothingStore.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly ClothingStoreContext _context;

        public OrderController(ClothingStoreContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Order>>> GetOrdersByUser(string userId)
        {
            try
            {
                var userIdLong = long.Parse(userId);
                var orders = await _context.Orders
                    .Where(o => o.UserId == userIdLong)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<Order>>> GetAllOrders()
        {
            try
            {
                var orders = await _context.Orders
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                // Get cart items for the user
                var cartItems = await _context.CartItems
                    .Where(c => c.UserId == request.UserId)
                    .ToListAsync();

                if (!cartItems.Any())
                {
                    return BadRequest(new { error = "Cart is empty" });
                }

                // Generate unique 8-digit order number
                var orderNumber = GenerateOrderNumber();

                // Create order
                var order = new Order
                {
                    UserId = request.UserId,
                    OrderDate = DateTime.Now,
                    TotalAmount = request.TotalAmount,
                    Status = "PLACED",
                    ShippingAddress = request.ShippingAddress,
                    City = request.City,
                    State = request.State,
                    Pincode = request.Pincode,
                    Phone = request.Phone,
                    PaymentStatus = "COMPLETED",
                    TotalItems = cartItems.Sum(c => c.Quantity),
                    OrderId = orderNumber,
                    PaymentType = "ONLINE",
                    DiscountAmount = 0
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Move cart items to order items
                foreach (var cartItem in cartItems)
                {
                    var product = await _context.Products.FindAsync(cartItem.ProductId);
                    var itemPrice = product?.DiscountedPrice ?? product?.BasePrice ?? 0;
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.Quantity,
                        Size = cartItem.Size,
                        Price = itemPrice,
                        ProductName = product?.Name,
                        DiscountPercent = (int?)(product?.DiscountPercent ?? 0),
                        TotalCost = itemPrice * cartItem.Quantity
                    };
                    _context.OrderItems.Add(orderItem);
                }

                // Clear cart
                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                var response = new {
                    id = order.Id,
                    userId = order.UserId,
                    orderDate = order.OrderDate,
                    totalAmount = order.TotalAmount,
                    status = order.Status,
                    shippingAddress = order.ShippingAddress,
                    city = order.City,
                    state = order.State,
                    pincode = order.Pincode,
                    phone = order.Phone,
                    paymentStatus = order.PaymentStatus,
                    totalItems = order.TotalItems,
                    orderId = order.OrderId
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private string GenerateOrderNumber()
        {
            var random = new Random();
            var orderNumber = random.Next(10000000, 99999999).ToString();
            
            // Check if order number already exists
            var exists = _context.Orders.Any(o => o.OrderId == orderNumber);
            if (exists)
            {
                return GenerateOrderNumber(); // Recursive call if duplicate
            }
            
            return orderNumber;
        }
    }

    public class CreateOrderRequest
    {
        public long UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}