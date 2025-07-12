using Microsoft.EntityFrameworkCore;
using ClothingStore.Data;
using ClothingStore.Models;

namespace ClothingStore.Services
{
    public class CategoryService
    {
        private readonly ClothingStoreContext _context;
        
        public CategoryService(ClothingStoreContext context)
        {
            _context = context;
        }
        
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }
        
        public async Task<Category?> GetCategoryByIdAsync(long id)
        {
            return await _context.Categories.FindAsync(id);
        }
        
        public async Task<Category> CreateCategoryAsync(string name)
        {
            var category = new Category
            {
                Name = name
            };
            
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }
        
        public async Task<Category?> UpdateCategoryAsync(long id, string name)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return null;
            
            category.Name = name;
            await _context.SaveChangesAsync();
            return category;
        }
        
        public async Task DeleteCategoryAsync(long id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }
    }
}