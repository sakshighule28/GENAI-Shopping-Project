using Microsoft.EntityFrameworkCore;
using ClothingStore.Data;
using ClothingStore.Models;

namespace ClothingStore.Services
{
    public class OrderService
    {
        private readonly ClothingStoreContext _context;
        
        public OrderService(ClothingStoreContext context)
        {
            _context = context;
        }
        
        public async Task<List<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders.ToListAsync();
        }
        
        public async Task<List<Order>> GetMyOrdersAsync(long userId)
        {
            return await _context.Orders.Where(o => o.UserId == userId).ToListAsync();
        }
    }
}