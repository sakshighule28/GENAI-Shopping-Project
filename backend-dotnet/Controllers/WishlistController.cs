using Microsoft.AspNetCore.Mvc;
using ClothingStore.Services;
using ClothingStore.Models;

namespace ClothingStore.Controllers
{
    [ApiController]
    [Route("api/wishlist")]
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _wishlistService;
        
        public WishlistController(WishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }
        
        [HttpPost("add")]
        public async Task<ActionResult> AddToWishlist([FromBody] WishlistRequest request)
        {
            try
            {
                var message = await _wishlistService.AddToWishlistAsync(request.UserId, request.ProductId);
                return Ok(new { message });
            }
            catch (Exception e)
            {
                return BadRequest(new { error = e.Message });
            }
        }
        
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Wishlist>>> GetWishlist(long userId)
        {
            var wishlist = await _wishlistService.GetWishlistAsync(userId);
            return Ok(wishlist);
        }
        
        [HttpGet("check")]
        public async Task<ActionResult<bool>> IsInWishlist([FromQuery] long userId, [FromQuery] long productId)
        {
            var isInWishlist = await _wishlistService.IsInWishlistAsync(userId, productId);
            return Ok(isInWishlist);
        }
        
        [HttpDelete("remove")]
        public async Task<ActionResult> RemoveFromWishlist([FromQuery] long userId, [FromQuery] long productId)
        {
            try
            {
                await _wishlistService.RemoveFromWishlistAsync(userId, productId);
                return Ok(new { message = "Removed from wishlist" });
            }
            catch (Exception e)
            {
                return BadRequest(new { error = e.Message });
            }
        }
    }
    
    public class WishlistRequest
    {
        public long UserId { get; set; }
        public long ProductId { get; set; }
    }
}