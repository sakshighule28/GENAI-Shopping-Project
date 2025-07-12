using Microsoft.EntityFrameworkCore;
using ClothingStore.Data;
using ClothingStore.Models;

namespace ClothingStore.Services
{
    public class WishlistService
    {
        private readonly ClothingStoreContext _context;
        
        public WishlistService(ClothingStoreContext context)
        {
            _context = context;
        }
        
        public async Task<string> AddToWishlistAsync(long userId, long productId)
        {
            var existing = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
                
            if (existing != null)
            {
                return "Already in wishlist";
            }
            
            var wishlist = new Wishlist
            {
                UserId = userId,
                ProductId = productId
            };
            
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
            return "Added to wishlist";
        }
        
        public async Task<List<Wishlist>> GetWishlistAsync(long userId)
        {
            return await _context.Wishlists
                .Where(w => w.UserId == userId)
                .ToListAsync();
        }
        
        public async Task<bool> IsInWishlistAsync(long userId, long productId)
        {
            return await _context.Wishlists
                .AnyAsync(w => w.UserId == userId && w.ProductId == productId);
        }
        
        public async Task RemoveFromWishlistAsync(long userId, long productId)
        {
            var wishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
                
            if (wishlist != null)
            {
                _context.Wishlists.Remove(wishlist);
                await _context.SaveChangesAsync();
            }
        }
    }
}