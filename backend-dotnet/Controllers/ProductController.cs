using Microsoft.AspNetCore.Mvc;
using ClothingStore.Services;
using ClothingStore.Models;

namespace ClothingStore.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;
        
        public ProductController(ProductService productService)
        {
            _productService = productService;
        }
        
        [HttpOptions]
        public ActionResult Options()
        {
            return Ok();
        }
        
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAllProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(long id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                return product != null ? Ok(product) : NotFound();
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }
        
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<List<Product>>> GetProductsByCategory(long categoryId)
        {
            try
            {
                var products = await _productService.GetProductsByCategoryAsync(categoryId);
                return Ok(products);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }
        
        [HttpGet("search")]
        public async Task<ActionResult<List<Product>>> SearchProducts([FromQuery] string name)
        {
            try
            {
                var products = await _productService.SearchProductsAsync(name);
                return Ok(products);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }
        
        [HttpGet("new")]
        public async Task<ActionResult<List<Product>>> GetNewProducts()
        {
            try
            {
                var products = await _productService.GetNewProductsAsync();
                return Ok(products);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }
    }
}