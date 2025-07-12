using Microsoft.EntityFrameworkCore;
using ClothingStore.Data;
using ClothingStore.Models;

namespace ClothingStore.Services
{
    public class ProductService
    {
        private readonly ClothingStoreContext _context;
        
        public ProductService(ClothingStoreContext context)
        {
            _context = context;
        }
        
        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }
        
        public async Task<Product?> GetProductByIdAsync(long id)
        {
            return await _context.Products.FindAsync(id);
        }
        
        public async Task<List<Product>> GetProductsByCategoryAsync(long categoryId)
        {
            return await _context.Products.Where(p => p.CategoryId == categoryId).ToListAsync();
        }
        
        public async Task<List<Product>> SearchProductsAsync(string name)
        {
            return await _context.Products
                .Where(p => p.Name.Contains(name) || (p.Brand != null && p.Brand.Contains(name)))
                .ToListAsync();
        }
        
        public async Task<List<Product>> GetNewProductsAsync()
        {
            return await _context.Products
                .OrderByDescending(p => p.Id)
                .Take(6)
                .ToListAsync();
        }
        
        public async Task<Product> CreateProductAsync(CreateProductRequest request)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == request.CategoryName);
            if (category == null)
            {
                throw new Exception("Category not found");
            }
            
            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                BasePrice = request.BasePrice,
                UnitsInStock = request.UnitsInStock,
                Brand = request.Brand,
                Sizes = request.Sizes,
                ImageUrl = request.ImageUrl,
                CategoryId = category.Id,
                DiscountPercent = 0,
                DiscountedPrice = request.BasePrice
            };
            
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }
        
        public async Task<Product?> UpdateProductAsync(long id, UpdateProductRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;
            
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == request.CategoryName);
            if (category == null)
            {
                throw new Exception("Category not found");
            }
            
            product.Name = request.Name;
            product.Description = request.Description;
            product.BasePrice = request.BasePrice;
            product.UnitsInStock = request.UnitsInStock;
            product.Brand = request.Brand;
            product.Sizes = request.Sizes;
            product.ImageUrl = request.ImageUrl;
            product.CategoryId = category.Id;
            
            await _context.SaveChangesAsync();
            return product;
        }
        
        public async Task<Product?> UpdateProductByNameAsync(UpdateByNameRequest request)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Name == request.ProductName);
            if (product == null) return null;
            
            product.BasePrice = request.BasePrice;
            product.UnitsInStock = request.UnitsInStock;
            product.Sizes = request.Sizes;
            
            await _context.SaveChangesAsync();
            return product;
        }
        
        public async Task<Product?> ApplyDiscountAsync(DiscountRequest request)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Name == request.ProductName);
            if (product == null) return null;
            
            product.DiscountPercent = request.DiscountPercent;
            product.DiscountedPrice = product.BasePrice * (1 - request.DiscountPercent / 100);
            
            await _context.SaveChangesAsync();
            return product;
        }
        
        public async Task DeleteProductAsync(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
    }
    
    public class CreateProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int UnitsInStock { get; set; }
        public string? Brand { get; set; }
        public string? Sizes { get; set; }
        public string? ImageUrl { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
    
    public class UpdateProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int UnitsInStock { get; set; }
        public string? Brand { get; set; }
        public string? Sizes { get; set; }
        public string? ImageUrl { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
    
    public class UpdateByNameRequest
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int UnitsInStock { get; set; }
        public string? Sizes { get; set; }
    }
    
    public class DiscountRequest
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal DiscountPercent { get; set; }
    }
}