using Microsoft.AspNetCore.Mvc;
using ClothingStore.Data;
using ClothingStore.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ClothingStoreContext _context;

        public CartController(ClothingStoreContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<CartItem>>> GetCartItems(long userId)
        {
            try
            {
                var cartItems = await _context.CartItems
                    .Where(c => c.UserId == userId)
                    .ToListAsync();

                return Ok(cartItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            try
            {
                var existingItem = await _context.CartItems
                    .FirstOrDefaultAsync(c => c.UserId == request.UserId && 
                                            c.ProductId == request.ProductId && 
                                            c.Size == request.Size);

                if (existingItem != null)
                {
                    existingItem.Quantity += request.Quantity;
                }
                else
                {
                    var cartItem = new CartItem
                    {
                        UserId = request.UserId,
                        ProductId = request.ProductId,
                        Quantity = request.Quantity,
                        Size = request.Size
                    };
                    _context.CartItems.Add(cartItem);
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Item added to cart" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete("clear/{userId}")]
        public async Task<ActionResult> ClearCart(long userId)
        {
            try
            {
                var cartItems = await _context.CartItems
                    .Where(c => c.UserId == userId)
                    .ToListAsync();

                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cart cleared" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class AddToCartRequest
    {
        public long UserId { get; set; }
        public long ProductId { get; set; }
        public int Quantity { get; set; }
        public string? Size { get; set; }
    }
}